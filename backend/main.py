from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import Any, Dict

app = FastAPI(title="Daily Check-In Companion API")

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

@app.get("/api/health")
async def health() -> Dict[str, Any]:
    """
    Health check endpoint.
    Returns a simple JSON object to verify the service is up.
    """
    return {"status": "ok"}
