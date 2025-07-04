// src/features/ai/utils/aiUtils.js

/**
 * 감성 분석 결과에 따라 색상을 반환합니다.
 * @param {string} sentiment - 'positive', 'negative', 'neutral' 중 하나.
 * @returns {string} 해당 감성에 맞는 CSS 색상 코드.
 */
export const getSentimentColor = (sentiment) => {
    switch (sentiment) {
        case 'positive':
            return 'green';
        case 'negative':
            return 'red';
        case 'neutral':
            return 'gray';
        default:
            return 'black';
    }
};