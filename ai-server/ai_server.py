import os
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv

# .env 파일 로드
load_dotenv()

app = FastAPI()

API_KEY = os.getenv("API_KEY")

if not API_KEY:
    # API_KEY가 설정되지 않은 경우, 환경 변수에서 가져오도록 안내
    # Canvas 환경에서는 API_KEY를 빈 문자열로 두면 런타임에 자동으로 제공됩니다.
    # 따라서 이 에러는 로컬 개발 환경에서만 발생할 수 있습니다.
    print("API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인하거나 Canvas 환경에서 실행해주세요.")
    # 개발 편의를 위해 임시로 설정하거나, 실제 배포 시에는 환경 변수 설정 필수
    # raise ValueError("API_KEY 환경 변수가 설정되지 않았습니다. .env 파일을 확인해주세요.")

# gemini-1.5-flash 모델로 설정
genai.configure(api_key=API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

# RestaurantVO와 ReviewVO에 해당하는 Pydantic 모델 정의 (AI 챗 기능에 추가됨)
# Spring Boot의 VO와 필드명이 일치해야 합니다. (JSON 직렬화 시 camelCase -> snake_case 변환 고려)
class RestaurantVO(BaseModel):
    # Spring Boot의 RestaurantVO 필드명과 일치시켜야 합니다.
    restaurantId: Optional[int] = None
    restaurantName: Optional[str] = None
    addrSido: Optional[str] = None
    addrSigungu: Optional[str] = None
    addrDong: Optional[str] = None
    addrDetail: Optional[str] = None
    phoneNumber: Optional[str] = None
    restaurantCategory: Optional[str] = None
    restaurantLat: Optional[float] = None
    restaurantLon: Optional[float] = None
    openHour: Optional[int] = None
    openMinute: Optional[int] = None
    closeHour: Optional[int] = None
    closeMinute: Optional[int] = None
    breakStartHour: Optional[int] = None
    breakStartMinute: Optional[int] = None
    breakEndHour: Optional[int] = None
    breakEndMinute: Optional[int] = None
    restaurantHoliday: Optional[str] = None
    parkingInfo: Optional[str] = None
    kakaoPlaceId: Optional[str] = None # TB_RESTAURANT.sql에 KAKAO_PLACE_ID가 있으므로 추가

class ReviewVO(BaseModel):
    # Spring Boot의 ReviewVO 필드명과 일치시켜야 합니다.
    reviewId: Optional[int] = None
    userId: Optional[int] = None
    restaurantId: Optional[int] = None
    reviewRating: Optional[float] = None
    reviewContent: Optional[str] = None
    aiSummary: Optional[str] = None
    aiKeywords: Optional[str] = None
    userNickname: Optional[str] = None # ReviewVO에 userNickname 필드가 있으므로 추가

# ChatRequest 모델 (AI 챗 기능에 추가됨)
class ChatRequest(BaseModel):
    message: str
    restaurants: Optional[List[RestaurantVO]] = None
    reviews: Optional[List[ReviewVO]] = None

# ChatResponse 모델 (AI 챗 기능에 추가됨)
class ChatResponse(BaseModel):
    response: str

@app.post("/chat", response_model=ChatResponse) # AI 챗 기능 엔드포인트
async def chat(request: ChatRequest): # ChatRequest 모델 사용
    user_input = request.message
    relevant_restaurants = request.restaurants
    relevant_reviews = request.reviews

    # AI 모델에 전달할 프롬프트 구성 (AI 챗 기능에 추가됨)
    prompt_parts = [
        "당신은 7번 국도를 여행하는 사람들을 위한 친절한 맛집 추천 챗봇입니다.",
        "사용자의 질문에 대해 당신이 알고 있는 정보와 제공된 식당 및 리뷰 데이터를 바탕으로 답변해주세요.",
        "만약 특정 식당이나 지역에 대한 정보가 충분하지 않다면, 사용자에게 더 구체적인 정보를 요청할 수 있습니다.",
        "답변은 한국어로, 친근하고 유용한 방식으로 제공해주세요.\n"
    ]

    if relevant_restaurants:
        prompt_parts.append("\n--- 참고할 식당 정보 ---")
        for i, rest in enumerate(relevant_restaurants):
            prompt_parts.append(f"식당 {i+1}:")
            prompt_parts.append(f"  이름: {rest.restaurantName or '정보 없음'}")
            prompt_parts.append(f"  주소: {rest.addrSido or ''} {rest.addrSigungu or ''} {rest.addrDong or ''} {rest.addrDetail or ''}".strip())
            prompt_parts.append(f"  카테고리: {rest.restaurantCategory or '정보 없음'}")
            if rest.phoneNumber:
                prompt_parts.append(f"  전화번호: {rest.phoneNumber}")
            if rest.openHour is not None and rest.closeHour is not None:
                prompt_parts.append(f"  영업시간: {rest.openHour:02d}:{rest.openMinute:02d} ~ {rest.closeHour:02d}:{rest.closeMinute:02d}")
            if rest.parkingInfo:
                prompt_parts.append(f"  주차정보: {rest.parkingInfo}")
            prompt_parts.append("") # 줄바꿈

    if relevant_reviews:
        prompt_parts.append("\n--- 참고할 리뷰 정보 ---")
        for i, review in enumerate(relevant_reviews):
            prompt_parts.append(f"리뷰 {i+1} (식당 ID: {review.restaurantId or '정보 없음'}):")
            prompt_parts.append(f"  작성자: {review.userNickname or '익명'}")
            prompt_parts.append(f"  평점: {review.reviewRating or '정보 없음'}점")
            prompt_parts.append(f"  내용: \"{review.reviewContent or '내용 없음'}\"")
            prompt_parts.append("") # 줄바꿈

    prompt_parts.append(f"\n--- 사용자 질문 ---")
    prompt_parts.append(user_input)
    prompt_parts.append("\n--- 답변 ---")

    final_prompt = "\n".join(prompt_parts)
    print(f"Generated Prompt for AI: \n{final_prompt}") # 디버깅용

    try:
        # Gemini 모델 호출
        response = model.generate_content(final_prompt)
        ai_response_content = response.text
    except Exception as e:
        print(f"AI 응답 생성 중 오류 발생: {e}")
        ai_response_content = "죄송합니다. AI 챗봇과 통신 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."

    return ChatResponse(response=ai_response_content)

# --- 리뷰 요약 및 키워드 추출 엔드포인트 (기존 기능 유지) ---
class ReviewRequest(BaseModel):
    review_text: str

class ReviewResponse(BaseModel): # 기존 ReviewResponse 모델
    summary: str
    keywords: List[str]

@app.post("/summarize-review", response_model=ReviewResponse) # response_model 추가
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
        print(f"AI 응답 생성 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=f"리뷰 요약 중 오류 발생: {str(e)}")

# --- 감성 분석 엔드포인트 (기존 기능 유지) ---
class SentimentRequest(BaseModel):
    text: str

class SentimentResponse(BaseModel): # 기존 SentimentResponse 모델
    sentiment: str

@app.post("/analyze-sentiment", response_model=SentimentResponse) # response_model 추가
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
            sentiment = "neutral" # 분류할 수 없는 경우

        return {"sentiment": sentiment}
    except Exception as e:
        print(f"AI 응답 생성 중 오류 발생: {e}")
        raise HTTPException(status_code=500, detail=f"감성 분석 중 오류 발생: {str(e)}")

