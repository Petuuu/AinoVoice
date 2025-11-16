from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, HTTPException
from typing import Optional
from openai import OpenAI, AsyncOpenAI
from dotenv import load_dotenv
import asyncio
from openai.helpers import LocalAudioPlayer
from fastapi.responses import StreamingResponse
from pathlib import Path
from sqlmodel import Session
from db import init_db
import os, json, re, traceback
import sqlite3
from db import get_connection, save_classification_from_output
from contextlib import asynccontextmanager


load_dotenv()

app = FastAPI(title="Daily Check-In Companion API")
client = (
    OpenAI(api_key=os.getenv("OPENAI_API_KEY")) if os.getenv("OPENAI_API_KEY") else None
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

prompt = None
input = None


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: ensure DB and table exist
    init_db()
    yield


@app.get("/classifications/")
def list_classifications():
    conn = get_connection()
    try:
        cur = conn.execute("SELECT * FROM mood_classifications")
        rows = cur.fetchall()
        keys = [
            "id",
            "mood_level",
            "energy_level",
            "loneliness_level",
            "risk_level",
            "summary",
        ]
        return [dict(zip(keys, row)) for row in rows[::-1]]
    finally:
        conn.close()


@app.post("/api/checkin/voice", tags=["Check-In"])
async def process_audio(uploaded_file: UploadFile = File(...)):
    global prompt
    global input
    try:
        contents = await uploaded_file.read()
        with open("audio.mp3", "wb") as f:
            f.write(contents)

        if client is not None:
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
        else:
            text = "No OpenAI API key configured; transcription skipped."

        # GPT CONFIG

        prompt = text
        print("PROMPT", prompt)

        classifications_response = client.responses.create(
            model="o4-mini",
            input=f"""You are an assistant analyzing check-in phrases from older adults.
                    Classify this "{prompt}" into: mood (0–3), energy (0–3), loneliness (0–3), risk (0–2), and give a short explanation.
                    Use the following rules for classification:
                    1) Mood: 3-positive / 2-neutral / 1-low / 0-very low
                    2) Energy: 3-active / 2-tired / 1-confused / 0-overwhelmed
                    3) Loneliness: 3-very lonely / 2-lonely / 1-missing family / 0-not lonely
                    4) Risk level: 2-High concern (Explicit risk phrases (fall, pain, scared) OR no response to 2 check-ins) / 1 – Soft concern (Mood worse than usual OR signs of loneliness) / 0 - OK (Mood stable or improved, no risk phrases)
                    5) Short summary: for example "User feels lonely and a bit tired but no acute danger."
                    IMPORTANT! Make sure to format your response the following way:
                    {{
                    "mood_level": 0-3,
                    "energy_level": 0-3,
                    "loneliness_level": 0-3,
                    "risk_level": 0-2,
                    "summary": "short summary"
                    }}
                    """,
        )

        classification = classifications_response.output[-1].content[0].text
        print("CLASSIFICATION: ", classification)
        save_classification_from_output(classification)
        voice_response = client.responses.create(
            model="o4-mini",
            input=f"""An elderly person is telling you about their day. Analyze their message: "{prompt}" and comfort them.
                        Make sure you're being supportive, while also allowing them to feel independent.
                        Respond in a warm, respectful tone suitable for elderly users. Don’t give medical advice. Make your answer 1-2 sentences long.
                        Leave an open ending or ask a question at the end, so the conversation flows naturally.""",
        )

        # TTS CONFIG

        openai = AsyncOpenAI()

        input = voice_response.output[-1].content[0].text

        print("INPUT: ", input)

        instructions = """Voice Affect: Calm, composed, and reassuring; project quiet authority and confidence.
                        Tone: Sincere, empathetic, and gently authoritative—express genuine apology while conveying competence.
                        Pacing: Steady and moderate; unhurried enough to communicate care, yet efficient enough to demonstrate professionalism.
                        Emotion: Genuine empathy and understanding; speak with warmth, especially during apologies (\"I'm very sorry for any disruption...\").
                        Pronunciation: Clear and precise, emphasizing key reassurances (\"smoothly,\" \"quickly,\" \"promptly\") to reinforce confidence.
                        Pauses: Brief pauses after offering assistance or requesting details, highlighting willingness to listen and support."""

        speech_file_path = "../frontend/public/speech.mp3"
        with client.audio.speech.with_streaming_response.create(
            model="gpt-4o-mini-tts",
            voice="echo",
            input=input,
            instructions=instructions,
        ) as response:
            response.stream_to_file(speech_file_path)

    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
