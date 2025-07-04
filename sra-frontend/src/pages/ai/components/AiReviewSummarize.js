// src/features/ai/components/AiReviewSummarizeTab.js
import React from 'react';
import useAiReviewSummarize from '../hooks/useAiReviewSummarize'; // 새로 생성할 훅 임포트

const AiReviewSummarize = () => {
    const {
        reviewInput,
        setReviewInput,
        reviewSummary,
        reviewKeywords,
        isReviewLoading,
        handleSummarizeSubmit
    } = useAiReviewSummarize();

    return (
        <div>
            <h3>리뷰 요약</h3>
            <textarea
                value={reviewInput}
                onChange={(e) => setReviewInput(e.target.value)}
                placeholder="요약할 리뷰 텍스트를 입력하세요..."
                rows="6"
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
                onClick={handleSummarizeSubmit}
                disabled={isReviewLoading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {isReviewLoading ? '요약 중...' : '요약'}
            </button>
            {reviewSummary && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                    <h4>요약:</h4>
                    <p>{reviewSummary}</p>
                    {reviewKeywords.length > 0 && (
                        <>
                            <h4>키워드:</h4>
                            <p>{reviewKeywords.join(', ')}</p>
                        </>
                    )}
                </div>
            )}
        </div>
    );
};

export default AiReviewSummarize;