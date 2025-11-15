from openai import OpenAI

client = OpenAI()
audio_file = open("/path/to/file/audio.mp3", "rb")

transcription = client.audio.transcriptions.create(
    model="whisper-1",
    file=audio_file,
    prompt="The following conversation is an elderly person telling you about their day. Please be patient and supportive and pay attention to their emotions.",
)
