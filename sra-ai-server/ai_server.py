import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import google.generativeai as genai
from dotenv import load_dotenv # dotenv 라이브러리 임포트

# .env 파일 로드
# 이 함수는 스크립트 실행 시 .env 파일에서 환경 변수를 자동으로 로드합니다.
load_dotenv()

app = FastAPI()

# Gemini API 키 설정: 환경 변수에서 API 키를 가져옵니다.
# 'API_KEY'라는 환경 변수가 설정되어 있어야 합니다.
API_KEY = os.getenv("API_KEY")

if not API_KEY:
    # API 키가 설정되지 않았다면 명확한 오류 메시지를 출력하고 종료합니다.
    raise ValueError("API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")

genai.configure(api_key=API_KEY)

# 사용할 Gemini 모델 지정 (새로운 모델명 적용)
model = genai.GenerativeModel("gemini-1.5-flash-latest")

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(data: ChatRequest):
    user_input = data.message
    try:
        response = model.generate_content(user_input)
        # Gemini 응답은 text 속성에 내용이 있습니다.
        return {"response": response.text}
    except Exception as e:
        # API 호출 중 오류 발생 시 500 에러와 함께 상세 메시지 반환
        raise HTTPException(status_code=500, detail=f"AI 응답 생성 중 오류 발생: {str(e)}")

# --- 추가된 리뷰 요약 및 키워드 추출 엔드포인트 ---
class ReviewRequest(BaseModel):
    review_text: str

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