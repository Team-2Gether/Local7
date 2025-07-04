import React from 'react';
import useAiChat from '../hooks/useAiChat'; 

const AiChat = () => {
    const {
        chatInput,
        setChatInput,
        chatResponse,
        isChatLoading,
        handleChatSubmit
    } = useAiChat();

    return (
        <div>
            <h3>AI 챗봇</h3>
            <textarea
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="AI에게 메시지를 입력하세요..."
                rows="4"
                style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
            />
            <button
                onClick={handleChatSubmit}
                disabled={isChatLoading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#28a745',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer'
                }}
            >
                {isChatLoading ? '전송 중...' : '전송'}
            </button>
            {chatResponse && (
                <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                    <h4>AI 응답:</h4>
                    <p>{chatResponse}</p>
                </div>
            )}
        </div>
    );
};

export default AiChat;