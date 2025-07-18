import React from 'react';
import useAiChat from '../hooks/useAiChat'; 
import './AiChat.css'

const AiChat = () => {
    const {
        chatInput,
        setChatInput,
        chatResponse,
        isChatLoading,
        handleChatSubmit
    } = useAiChat();

    return (
        <div className="ai-chat-container">
            <h3>AI 챗봇</h3>
            <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="7봇에게 7번국도에 해당하는 도시명을 포함해서 질문해주세요..."
                rows="4"
                className="ai-chat-textarea"
            />
            <button
                onClick={handleChatSubmit}
                disabled={isChatLoading}
                className="ai-chat-submit-button"
            >
                {isChatLoading ? '전송 중...' : '전송'}
            </button>
            {chatResponse && (
                <div className="ai-chat-response-box">
                    <h4>AI 응답:</h4>
                    <p>{chatResponse}</p>
                </div>
            )}
        </div>
    );
};

export default AiChat;
