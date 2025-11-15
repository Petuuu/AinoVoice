from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from dotenv import load_dotenv
from openai import OpenAI
from sqlmodel import Session
from db import init_db, get_session, AlertRecord
import os, json, re, traceback

load_dotenv()

app = FastAPI(title="Daily Check-In Companion API")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

transcription_global: Optional[str] = None

@app.on_event("startup")
def _startup():
    try:
        init_db()
    except Exception as e:
        print("[startup:init_db]", e)

@app.get("/ping")
async def ping():
    return {"message": "pong"}

@app.post("/api/checkin/voice", tags=["Check-In"])
async def process_audio(
    uploaded_file: UploadFile = File(...),
    session: Session = Depends(get_session),
):
    """Transcribe, classify, persist alert, and generate TTS to frontend/public/speech.mp3."""
    global transcription_global
    try:
        # Save uploaded audio
        contents = await uploaded_file.read()
        with open("audio.mp3", "wb") as f:
            f.write(contents)

        if not client:
            raise HTTPException(status_code=500, detail="OPENAI_API_KEY not configured")

        # Transcribe via Whisper
        with open("audio.mp3", "rb") as audio_file:
            transcription = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                prompt=(
                    "The following conversation is an elderly person telling you about their day. "
                    "Please be patient and supportive and pay attention to their emotions."
                ),
            )
        text = getattr(transcription, "text", None) or str(transcription)
        transcription_global = text

        # Classify mood/energy/loneliness/risk
        classification_prompt = (
            "You are an assistant analyzing check-in phrases from older adults.\n"
            f"Classify this reply: \"{text}\" into: mood (0–3), energy (0–3), loneliness (0–3), risk (0–2), and give a short explanation.\n"
            "Rules:\n"
            "1) Mood: 3-positive / 2-neutral / 1-low / 0-very low\n"
            "2) Energy: 3-active / 2-tired / 1-confused / 0-overwhelmed\n"
            "3) Loneliness: 3-not lonely / 2-missing family / 1-lonely / 0-very lonely\n"
            "4) Risk level: 2-High concern (Explicit risk phrases (fall, pain, scared) OR missed 2 check-ins) / 1-Soft concern (worse mood OR signs of loneliness) / 0-OK (stable/improved)\n"
            "5) Short summary example: \"User feels lonely and a bit tired but no acute danger.\"\n"
            "Return ONLY valid JSON in this exact shape (numbers are examples):\n"
            "{{\n"
            "  \"mood_level\": 1,\n"
            "  \"energy_level\": 2,\n"
            "  \"loneliness_level\": 0,\n"
            "  \"risk_level\": 0,\n"
            "  \"summary\": \"short summary\"\n"
            "}}\n"
            "Output ONLY JSON."
        )
        cls_resp = client.responses.create(model="o4-mini", input=classification_prompt)
        raw = getattr(cls_resp, "output_text", None) or str(cls_resp.output or cls_resp)
        raw = raw.strip()
        start, end = raw.find("{"), raw.rfind("}")
        parsed = {}
        if start != -1 and end != -1 and end > start:
            json_block = raw[start : end + 1]
            json_block = re.sub(r"//.*", "", json_block)
            try:
                parsed = json.loads(json_block)
            except Exception as e:
                print("[classify json parse]", e, json_block[:200])

        mood = int(parsed.get("mood_level", 1))
        energy = int(parsed.get("energy_level", 1))
        loneliness = int(parsed.get("loneliness_level", 1))
        risk = int(parsed.get("risk_level", 0))
        summary = str(parsed.get("summary", "")).strip() or ""

        # Save alert to DB with all levels
        alert_id = None
        try:
            rec = AlertRecord(
                mood_level=mood,
                energy_level=energy,
                loneliness_level=loneliness,
                risk_level=risk,
                summary=summary or "",
            )
            session.add(rec)
            session.commit()
            session.refresh(rec)
            alert_id = rec.id
        except Exception as db_err:
            print("[db save alert]", db_err)

        # Supportive voice response text
        supportive_prompt = (
            f'An elderly person says: "{text}". Respond briefly in a warm, respectful, encouraging tone without medical advice.'
        )
        voice_resp = client.responses.create(model="o4-mini", input=supportive_prompt)
        supportive_text = getattr(voice_resp, "output_text", None) or str(voice_resp.output or voice_resp)

        # TTS stream to frontend/public/speech.mp3
        speech_file_path = "../frontend/public/speech.mp3"
        try:
            with client.audio.speech.with_streaming_response.create(
                model="gpt-4o-mini-tts",
                voice="alloy",
                input=supportive_text,
            ) as resp:
                resp.stream_to_file(speech_file_path)
        except Exception as tts_err:
            print("[tts]", tts_err)

        return {
            "transcription": text,
            "analysis": {
                "mood_level": mood,
                "energy_level": energy,
                "loneliness_level": loneliness,
                "risk_level": risk,
                "summary": summary,
            },
            "alert_id": alert_id,
            "supportive_text": supportive_text,
        }
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
