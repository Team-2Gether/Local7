import { useState } from 'react';
import { analyzeSentiment } from '../../../api/AiApi'; // api 폴더의 aiApi 임포트

const useAiSentimentAnalysis = () => {
    const [sentimentInput, setSentimentInput] = useState('');
    const [sentimentResult, setSentimentResult] = useState('');
    const [isSentimentLoading, setIsSentimentLoading] = useState(false);

    const handleAnalyzeSentiment = async () => {
        if (!sentimentInput.trim()) return;
        setIsSentimentLoading(true);
        setSentimentResult(''); // 이전 결과 초기화
        try {
            const result = await analyzeSentiment(sentimentInput);
            setSentimentResult(result);
        } catch (error) {
            setSentimentResult('감성 분석에 실패했습니다.');
            console.error('감성 분석 오류:', error);
        } finally {
            setIsSentimentLoading(false);
        }
    };

    return {
        sentimentInput,
        setSentimentInput,
        sentimentResult,
        isSentimentLoading,
        handleAnalyzeSentiment
    };
};

export default useAiSentimentAnalysis;