// AI 챗봇에 보낼 메시지 구조
export interface AiChatRequest {
  message: string;
}

// 챗봇 응답 받는 구조
export interface AiChatResponse {
  response: string;
}

// 리뷰 요약/분석 요청 구조
export interface AiReviewRequest {
  review_text: string;
}

// 요약된 내용, 키워드 결과
export interface AiReviewResponse {
  summary: string;
  keywords: string[];
}

// 감정 분석 요청 구조
export interface SentimentRequest {
  text: string;
}

// 분석 결과 구조
export interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral'; 
}
