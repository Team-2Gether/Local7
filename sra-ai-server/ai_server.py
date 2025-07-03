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

genai.configure(api_key=API_KEY)

model = genai.GenerativeModel("gemini-2.0-flash")

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

# --- 추가된 리뷰 요약 및 키워드 추출 엔드포인트 ---
class ReviewRequest(BaseModel):
    review_text: str

class KeywordRequest(BaseModel): 
    text: str

@app.post("/summarize-review")
async def summarize_review(request: ReviewRequest):
    try:
        prompt = f"""다음 맛집 리뷰를 한국어로 간결하게 요약하고, 핵심 키워드를 3개 정도 추출해줘.
        키워드는 '#'을 붙여서 요약 아래에 나열해줘.

        리뷰: "{request.review_text}"

        요약:
        키워드:
        """

        response = model.generate_content(prompt)
        summary_and_keywords = response.text.strip()

        summary = ""
        keywords = []
        if "요약:" in summary_and_keywords and "키워드:" in summary_and_keywords:
            parts = summary_and_keywords.split("키워:")
            summary = parts[0].replace("요약:", "").strip()
            if len(parts) > 1:
                keywords_str = parts[1].replace("워:", "").strip()
                keywords = [k.strip().replace("#", "") for k in keywords_str.split('#') if k.strip()]
        else:
            summary = summary_and_keywords
            keywords = ["요약_불가", "키워드_불가"]

        return {"summary": summary, "keywords": keywords}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"리뷰 요약 중 오류 발생: {str(e)}")

# 키워드 추출 엔드포인트 추가 
@app.post("/extract-keywords")
async def extract_keywords(request: KeywordRequest):
    try:
        prompt = f"""다음 텍스트에서 핵심 키워드 3~5개를 추출해줘. 
        키워드는 쉼표(,)로 구분해서 나열해줘.

        텍스트: "{request.text}"

        키워드:
        """
        response = model.generate_content(prompt)
        extracted_text = response.text.strip().replace("키워드:", "").strip()
        keywords = [k.strip() for k in extracted_text.split(',') if k.strip()]
        return {"keywords": keywords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"키워드 추출 중 오류 발생: {str(e)}")
    
class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel):
    sentiment: str # 긍정 (positive), 부정 (negative), 중립 (neutral) 등으로 분류

@app.post("/analyze-sentiment")
async def analyze_sentiment(request: SentimentRequest):
    try:
        # Gemini 모델에 감성 분석 프롬프트 전달
        prompt = f"""다음 한국어 텍스트의 감성을 긍정(positive), 부정(negative), 또는 중립(neutral) 중 하나로 분류해줘.
        오직 분류 결과(positive, negative, neutral)만 반환해줘.

        텍스트: "{request.text}"
        감성:"""

        response = model.generate_content(prompt)
        sentiment_result = response.text.strip().lower() # 결과값을 소문자로 변환

        # 유효한 감성 분류인지 확인 (Gemini가 항상 정확히 지정된 형태로 응답하지 않을 수 있으므로)
        if "positive" in sentiment_result:
            sentiment = "positive"
        elif "negative" in sentiment_result:
            sentiment = "negative"
        elif "neutral" in sentiment_result:
            sentiment = "neutral"
        else:
            # 예상치 못한 응답일 경우 중립으로 처리하거나 오류 발생시킬 수 있음
            sentiment = "neutral" 
            print(f"Warning: Unexpected sentiment response from AI: {sentiment_result}")

        return {"sentiment": sentiment}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"감성 분석 중 오류 발생: {str(e)}")    