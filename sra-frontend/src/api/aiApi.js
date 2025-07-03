import axios from 'axios';

// Spring Boot 백엔드의 기본 URL
const API_BASE_URL = 'http://localhost:8080/api/ai';

/**
 * AI 챗봇과 대화하는 API 호출 함수
 * @param {string} message - 사용자 메시지
 * @returns {Promise<string>} AI 챗봇 응답
 */
export const chatWithAi = async (message) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/chat`, { message });
        return response.data.response; // Spring Boot의 AiChatResponse에서 response 필드 추출
    } catch (error) {
        console.error('Error chatting with AI:', error);
        throw error;
    }
};

/**
 * 리뷰 텍스트를 AI로 요약하는 API 호출 함수
 * @param {string} reviewText - 요약할 리뷰 텍스트
 * @returns {Promise<{summary: string, keywords: string[]}>} 요약된 내용과 키워드
 */
export const summarizeReview = async (reviewText) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/summarize-review`, { review_text: reviewText });
        // Spring Boot의 AiReviewResponse에서 summary와 keywords 필드 추출
        return {
            summary: response.data.summary,
            keywords: response.data.keywords
        };
    } catch (error) {
        console.error('Error summarizing review:', error);
        throw error;
    }
};

/**
 * 텍스트에서 AI로 핵심 키워드를 추출하는 API 호출 함수
 * @param {string} text - 키워드를 추출할 텍스트
 * @returns {Promise<{keywords: string[]}>} 추출된 키워드 리스트
 */
export const extractKeywords = async (text) => {
    try {
        const response = await axios.post(`${API_BASE_URL}/extract-keywords`, { text });
        return {
            keywords: response.data.keywords
        };
    } catch (error) {
        console.error('Error extracting keywords:', error);
        throw error;
    }
};