from openai import OpenAI
from whisper_config import transcription

client = OpenAI()
prompt = transcription.text

classifications_response = client.responses.create(
    model="o4-mini",
    input="""An elderly person is telling you about their day.
            Analyse their message: {prompt} and do the following
            things:
            1) Classify their reply: positive / neutral / low / very low.
            2) Assign one or more of the following tags to the reply: active / tired / confused / overwhelmed.
            3) Pay attention to risk phrases that indicate that something isn't right (Examples: “fell”, “pain”, “dizzy”, “I can’t get up”, “I don’t feel safe”.)
            4) Pay attention to loneliness signals (Phrases like “no one to talk to”, “alone again today”)
            Give your answer in JSON format with the following parameters: "Classification" : "positive/neutral/low/very low.",
                                                                            "Tags" : "tags",
                                                                            "Risk_phrases" : "risk phrases",
                                                                            "Loneliness" : "alert/no alert".
            """,
)

voice_response = client.responses.create(
    model="o4-mini",
    input="""An elderly person is telling you about their day. Analyze their message and comfort them.
                Make sure you're being supportive, while also allowing them to feel independent. """,
)
