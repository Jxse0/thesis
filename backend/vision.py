import base64
from openaiClient import client



def vision(file):
     try:
          with open(file, "rb") as image_file:
               encoded_image = base64.b64encode(image_file.read()).decode("utf-8")

          response = client.chat.completions.create(
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
          result = response.choices[0].message.content
          return result

     except Exception as e:
          return f"An error occurred: {str(e)}"

