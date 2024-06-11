from openaiClient import client

def transcription(file):
     try:
        with open(file, "rb") as audio_file:
            response = client.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file
            )
            return response.text

     except Exception as e:
          return f"An error occurred: {str(e)}"
     
