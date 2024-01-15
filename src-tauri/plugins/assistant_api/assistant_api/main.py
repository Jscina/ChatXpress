from openai import Client
from dotenv import load_dotenv
import os

load_dotenv()

client = Client(api_key=os.getenv("OPENAI_API_KEY"))

assistant = client.beta.assistants.list(limit=1)

print(assistant.model_dump()["data"][0])
