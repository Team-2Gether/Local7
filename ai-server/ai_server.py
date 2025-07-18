import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv 

# .env 파일 로드
load_dotenv()

app = FastAPI()

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    raise ValueError("API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")

# gemini-1.5-flash 모델로 설정
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash") 

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatRequest):
    user_input = data.message
    try:
        response = model.generate_content(user_input)
        return {"response": response.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI 응답 생성 중 오류 발생: {str(e)}")

# --- 리뷰 요약 및 키워드 추출 엔드포인트 ---
class ReviewRequest(BaseModel):
    review_text: str

@app.post("/summarize-review")
async def summarize_review(request: ReviewRequest):
    try:
        # 수정된 프롬프트: 요약과 키워드를 '---'로 명확하게 구분하도록 요청
        prompt = f"""다음 맛집 리뷰를 한국어로 간결하게 요약하고, 핵심 키워드를 3개 정도 추출해줘.
        요약과 키워드는 '---'로 구분해줘.
        키워드는 '#'을 붙여서 공백으로 나열해줘.

        리뷰: "{request.review_text}"

        요약:
        맛있는 파스타와 분위기가 좋은 곳.
        ---
        키워드: #파스타 #분위기 #맛집
        """
        response = model.generate_content(prompt)
        summary_and_keywords = response.text.strip()

        # 수정된 파싱 로직: '---' 구분자를 기준으로 분리
        if '---' in summary_and_keywords:
            parts = summary_and_keywords.split('---', 1)
            summary = parts[0].replace('요약:', '').strip()
            keywords_str = parts[1].replace('키워드:', '').strip()
            keywords = [k.strip() for k in keywords_str.split('#') if k.strip()]
        else:
            # 예상치 못한 형식일 경우를 대비한 대체 로직
            summary = "요약을 생성할 수 없습니다."
            keywords = []

        return {"summary": summary, "keywords": keywords}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"리뷰 요약 중 오류 발생: {str(e)}")
        
# --- 감성 분석 엔드포인트 ---
class SentimentRequest(BaseModel):
    text: str
class SentimentResponse(BaseModel):
    sentiment: str

@app.post("/analyze-sentiment")
async def analyze_sentiment(request: SentimentRequest):
    try:
        prompt = f"""다음 한국어 텍스트의 감성을 긍정(positive), 부정(negative), 또는 중립(neutral) 중 하나로 분류해줘.
        오직 분류 결과(positive, negative, neutral)만 반환해줘.

        텍스트: "{request.text}"
        감성:"""

        response = model.generate_content(prompt)
        sentiment_result = response.text.strip().lower()

        if "positive" in sentiment_result:
            sentiment = "positive"
        elif "negative" in sentiment_result:
            sentiment = "negative"
        elif "neutral" in sentiment_result:
            sentiment = "neutral"
        else:
            sentiment = "neutral"

        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"감성 분석 중 오류 발생: {str(e)}")