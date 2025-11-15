import asyncio

from openai import AsyncOpenAI
from openai.helpers import LocalAudioPlayer
from gpt_config import voice_response

openai = AsyncOpenAI()

input = voice_response.output

instructions = """Voice Affect: Calm, composed, and reassuring; project quiet authority and confidence.
                Tone: Sincere, empathetic, and gently authoritative—express genuine apology while conveying competence.
                Pacing: Steady and moderate; unhurried enough to communicate care, yet efficient enough to demonstrate professionalism.
                Emotion: Genuine empathy and understanding; speak with warmth, especially during apologies (\"I'm very sorry for any disruption...\").
                Pronunciation: Clear and precise, emphasizing key reassurances (\"smoothly,\" \"quickly,\" \"promptly\") to reinforce confidence.
                Pauses: Brief pauses after offering assistance or requesting details, highlighting willingness to listen and support."""


async def main() -> None:
    async with openai.audio.speech.with_streaming_response_create(
        model="gpt-4o-mini-tts",
        voice="echo",
        input=input,
        instructions=instructions,
        response_format="pcm",
    ) as response:
        await LocalAudioPlayer().play(response)


if __name__ == "__main__":
    asyncio.run(main())
