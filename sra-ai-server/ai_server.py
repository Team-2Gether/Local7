from fastapi import FastAPI
from pydantic import BaseModel
import google.generativeai as genai

app = FastAPI()

genai.configure(api_key="AIzaSyC9fK6gwkMcCH0JkQ_3TGdKgsMuUrkdj60")

model = genai.GenerativeModel("gemini-1.5-flash-latest")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatRequest): 
    user_input = data.message

    response = model.generate_content(user_input)
    return {"response": response.text}