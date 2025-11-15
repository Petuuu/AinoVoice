from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, HTTPException
from typing import Optional
import os
import traceback
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Daily Check-In Companion API")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/ping")
async def ping():
    return {"message": "pong"}


@app.post("/api/checkin/voice", tags=["Check-In"])
async def process_audio(uploaded_file: UploadFile = File(...)):
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

        print(text)
        return {"transcription": text}
    except Exception as e:
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))
