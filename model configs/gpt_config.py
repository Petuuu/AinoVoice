from openai import OpenAI

client = OpenAI()
prompt = ""  # whisper response

response = client.responses.create(
    model="o4-mini",
    input="""An elderly person is telling you about their day.
            Analyse their answer: {prompt} and do the following
            things:
            1) Classify their reply: positive / neutral / low / very low.
            2) Assign one or more of the following tags to the reply: active / tired / confused / overwhelmed.
            3) Pay attention to risk phrases that indicate that something isn't right (Examples: “fell”, “pain”, “dizzy”, “I can’t get up”, “I don’t feel safe”.)
            4) Pay attention to loneliness signals (Phrases like “no one to talk to”, “alone again today”)
            Give your answer in json format with the following parameters: Classification, tags, risk_phrases, loneliness.
            """,
)
