// src/features/ai/components/AiSentimentAnalysisTab.js
import React from 'react';
import useAiSentimentAnalysis from '../hooks/useAiSentimentAnalysis'; // 새로 생성할 훅 임포트
import { getSentimentColor } from '../utils/aiUtils'; // 새로 생성할 유틸리티 함수 임포트

const AiSentimentAnalysis = () => {
    const {
        sentimentInput,
        setSentimentInput,
        sentimentResult,
        isSentimentLoading,
        handleAnalyzeSentiment
    } = useAiSentimentAnalysis();

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>텍스트 감성 분석</h3>
            <textarea
                value={sentimentInput}
                onChange={(e) => setSentimentInput(e.target.value)}
                placeholder="감성 분석할 텍스트를 입력하세요..."
                rows="5"
                style={{ width: 'calc(100% - 22px)', padding: '10px', marginBottom: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
            ></textarea>
            <button
                onClick={handleAnalyzeSentiment}
                disabled={isSentimentLoading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {isSentimentLoading ? '분석 중...' : '감성 분석'}
            </button>
            {sentimentResult && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                    <h4>분석 결과:</h4>
                    <p style={{ fontWeight: 'bold', color: getSentimentColor(sentimentResult) }}>
                        {sentimentResult === 'positive' ? '긍정적 😊' : sentimentResult === 'negative' ? '부정적 😠' : '중립 😐'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default AiSentimentAnalysis;