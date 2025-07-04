// src/features/ai/types/aiTypes.ts

export interface AiChatRequest {
  message: string;
}

export interface AiChatResponse {
  response: string;
}

export interface AiReviewRequest {
  review_text: string;
}

export interface AiReviewResponse {
  summary: string;
  keywords: string[];
}

export interface SentimentRequest {
  text: string;
}

export interface SentimentResponse {
  sentiment: 'positive' | 'negative' | 'neutral'; 
}
