from dotenv import load_dotenv
import os
from openai import OpenAI


load_dotenv()
secret_key = os.getenv('OPENAI_API_KEY')

ai = OpenAI(
    api_key=secret_key,
 )


def transcription(file):
     try:
        audio_file = open(file, "rb")
        response = ai.audio.transcriptions.create(
        model="whisper-1",
        file=audio_file
        )
        print(response.text)
        return(response.text)

     except Exception as e:
          return f"An error occurred: {str(e)}"
     
