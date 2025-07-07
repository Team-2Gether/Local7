import { useState } from 'react';
import { chatWithAi } from '../../../api/aiApi';

const useAiChat = () => {
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    const handleChatSubmit = async () => {
        if (!chatInput.trim()) return;
        setIsChatLoading(true);
        setChatResponse(''); // 이전 응답 초기화
        try {
            const response = await chatWithAi(chatInput);
            setChatResponse(response);
        } catch (error) {
            setChatResponse('AI 응답을 가져오는 데 실패했습니다.');
            console.error(error);
        } finally {
            setIsChatLoading(false);
        }
    };

    return {
        chatInput,
        setChatInput,
        chatResponse,
        isChatLoading,
        handleChatSubmit
    };
};

export default useAiChat;