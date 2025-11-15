from openai import OpenAI
from whisper_config import transcription

client = OpenAI()
prompt = transcription.text

classifications_response = client.responses.create(
    model="o4-mini",
    input="""You are an assistant analyzing check-in phrases from older adults.
            Classify this {prompt} into: mood (0–3), energy (0–3), loneliness (0–3), risk (0–2), and give a short explanation.
            Use the following rules for classification:
            1) Mood: 3-positive / 2-neutral / 1-low / 0-very low
            2) Energy: 3-active / 2-tired / 1-confused / 0-overwhelmed
            3) Loneliness: 3-not lonely / 2-missing family / 1-lonely / 0-very lonely
            4) Risk level: 2-High concern (Explicit risk phrases (fall, pain, scared) OR no response to 2 check-ins) / 1 – Soft concern (Mood worse than usual OR signs of loneliness) / 0 - OK (Mood stable or improved, no risk phrases)
            5) Short summary: for example "User feels lonely and a bit tired but no acute danger."
            IMPORTANT! Make sure to format your response the following way:
            {
            "mood_level": 0-3,
            "energy_level": 0-3,
            "loneliness_level": 0-3,
            "risk_level": 0-2,
            "summary": "short summary"
            }
            """,
)

voice_response = client.responses.create(
    model="o4-mini",
    input="""An elderly person is telling you about their day. Analyze their message and comfort them.
                Make sure you're being supportive, while also allowing them to feel independent. """,
)
