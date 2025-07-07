import { useState } from 'react';
import { summarizeReview } from '../../../api/aiApi'; 

const useAiReviewSummarize = () => {
    const [reviewInput, setReviewInput] = useState('');
    const [reviewSummary, setReviewSummary] = useState('');
    const [reviewKeywords, setReviewKeywords] = useState([]);
    const [isReviewLoading, setIsReviewLoading] = useState(false);

    const handleSummarizeSubmit = async () => {
        if (!reviewInput.trim()) return;
        setIsReviewLoading(true);
        setReviewSummary(''); // 이전 요약 초기화
        setReviewKeywords([]); // 이전 키워드 초기화
        try {
            const { summary, keywords } = await summarizeReview(reviewInput);
            setReviewSummary(summary);
            setReviewKeywords(keywords);
        } catch (error) {
            setReviewSummary('리뷰 요약에 실패했습니다.');
            setReviewKeywords([]);
            console.error(error);
        } finally {
            setIsReviewLoading(false);
        }
    };

    return {
        reviewInput,
        setReviewInput,
        reviewSummary,
        reviewKeywords,
        isReviewLoading,
        handleSummarizeSubmit
    };
};

export default useAiReviewSummarize;