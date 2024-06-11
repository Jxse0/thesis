from dotenv import load_dotenv
import os
from openai import OpenAI

load_dotenv()
secret_key = os.getenv('OPENAI_API_KEY')

client = OpenAI(
    api_key=secret_key,
 )