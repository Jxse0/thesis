from dotenv import load_dotenv
import os
from openai import OpenAI
from moviepy.editor import VideoFileClip
import uuid


load_dotenv()
secret_key = os.getenv('OPENAI_API_KEY')

ai = OpenAI(
    api_key=secret_key,
 )


def transcription(file):
    try:
        with open(file, "rb") as audio_file:
            response = ai.audio.transcriptions.create(
                model="whisper-1",
                file=audio_file,
                response_format  = "verbose_json",
                timestamp_granularities=["segment"]
            )

            segments_info = [] 
            for segment in response.segments:
                segments_info.append({
                    "start": segment['start'],
                    "end": segment['end'],
                    "text": segment['text']
                })
            return segments_info

    except Exception as e:
         return f"An error occurred: {str(e)}"
    finally:
        # Ensure the file is deleted after processing
        if file and os.path.exists(file):
            try:
                os.remove(file)
            except Exception as e:
                return f"Error deleting file {file}: {e}"


def subtitle(video_file):
    # Load the video file
    video = VideoFileClip(video_file)

    # Extract audio
    audio = video.audio

    # Generate a unique ID for the audio file
    unique_id = str(uuid.uuid4())

    # Define the output directory
    output_dir = "audio"
    os.makedirs(output_dir, exist_ok=True)

    # Define the output audio file path
    output_audio = os.path.join(output_dir, f"{unique_id}.mp3")

    # Write audio to file
    audio.write_audiofile(output_audio)

    # Close the video file
    video.close()

    return transcription(output_audio)     