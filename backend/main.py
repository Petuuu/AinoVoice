from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi import UploadFile, File, Form, HTTPException
from typing import Any, Dict, Optional
from openai import OpenAI

app = FastAPI(title="Daily Check-In Companion API")
client = OpenAI(api_key="OPENAI_API_KEY")
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
    # Save the uploaded file
    with open("audio.mp3", "wb") as f:
        f.write(await uploaded_file.read())  # 'await' is allowed here

    # Now use Whisper
    with open("audio.mp3", "rb") as audio_file:
        transcription = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            prompt="The following conversation is an elderly person telling you about their day. Please be patient and supportive and pay attention to their emotions.",
        )
    return {"transcription": transcription.text}