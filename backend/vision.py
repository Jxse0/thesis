import base64
from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
secret_key = os.getenv('OPENAI_API_KEY')

ai = OpenAI(
    api_key=secret_key,
 )


def vision(file):
     try:
          with open(file, "rb") as image_file:
               encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

          response = ai.chat.completions.create(
               model="gpt-4o",
               messages=[
                    {
                         "role": "user",
                         "content": [
                              {"type": "text", "text": "What’s in this image?"},
                              {
                                   "type": "image_url",
                                   "image_url": {
                                        "url": f"data:image/jpeg;base64,{encoded_image}",
                                   },
                              },
                         ],
                    }
               ],
               max_tokens=300,
          )
          return response.choices[0].message.content

     except Exception as e:
          return f"An error occurred: {str(e)}"

