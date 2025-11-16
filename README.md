# AinoVoice - The Voice of Care

## Overview

**AinoVoice** is a voice-based AI companion designed to support older adults in maintaining independence, wellbeing, and social connection.
With natural voice check-ins, emotional understanding, and anomaly detection, AinoVoice provides gentle daily support while keeping families informed when something seems off, always respecting dignity, autonomy, and privacy.


## Problem

By 2050, older adults will outnumber children under 5.
Across Finland and globally, loneliness, social isolation, and subtle changes in daily routines often go unnoticed until they escalate into more serious issues.
Yet older adults may not always proactively ask for help, and families often struggle to stay informed.

There is a need for a non-intrusive, empathetic, and human-centered AI that can check in regularly, understand how a person is doing, and notify loved ones when routines or mood shift in concerning ways.


## Solution

**AinoVoice** performs short, natural voice-based check-ins.
The user simply speaks, and the AI:
- Transcribes speech (Whisper ASR)
- Analyzes mood, energy, loneliness, and risk signals (LLM)
- Detects anomalies by comparing today’s state with previous check-ins
- Responds gently with supportive, voice-generated replies
- Notifies family members through a lightweight dashboard when something seems unusual
- Keeps a simple wellbeing history that caregivers can view at any time

The assistant does not attempt to replace medical professionals or emergency systems. Instead, it acts as a soft layer of emotional and routine awareness, enabling earlier support and more meaningful family connection.


## Human-Centered Design

- Large, simple UI designed for older adults
- Voice-first interaction, no typing required
- Warm, respectful tone
- No medical claims, no surveillance
- User is always in control
- Alerts are gentle, not alarming


## Impact

**AinoVoice** can help:
- Reduce loneliness
- Encourage healthy routines
- Surface early signs of wellbeing changes
- Improve family communication
- Support independent living at home


## Tech Stack

- Frontend: Next.js 15, React, Tailwind, shadcn/ui
- Backend: FastAPI, Python
- AI: OpenAI Whisper (STT), GPT-based wellbeing analysis, TTS voice replies
- Database: SQLite

## Why it matters

**AinoVoice** reimagines AI not as a tool of automation, but as an empathetic digital companion that helps people stay connected, independent, and supported as they age, turning aging well into a shared achievement across generations.


# Getting Started

Run frontend:

```bash
cd frontend/

npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Run backend:

```bash
cd backend/

uvicorn main:app --reload
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
