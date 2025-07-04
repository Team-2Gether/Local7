// src/features/ai/components/AiModal.js
import React, { useState } from 'react';
import Modal from 'react-modal';

// 각 기능별 탭 컴포넌트 임포트
import AiChat from './AiChat';
import AiReviewSummarize from './AiReviewSummarize';
import AiSentimentAnalysis from './AiSentimentAnalysis';


// 모달의 접근성을 위한 설정 (필수): #root는 React 앱의 기본 DOM 요소 ID
// 이 설정은 앱의 최상위 레벨에서 한 번만 해주면 됩니다.
Modal.setAppElement('#root');

const AiModal = ({ isOpen, onRequestClose }) => {
    const [activeTab, setActiveTab] = useState('chat'); // 'chat', 'summarize', 'sentiment'

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="AI 기능 모달"
            style={{
                overlay: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
                content: {
                    top: '50%',
                    left: '50%',
                    right: 'auto',
                    bottom: 'auto',
                    marginRight: '-50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50%',
                    maxWidth: '600px',
                    padding: '20px',
                    borderRadius: '8px'
                }
            }}
        >
            <h2>AI 기능</h2>
            <div>
                <button
                    onClick={() => setActiveTab('chat')}
                    style={{
                        padding: '10px 15px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'chat' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'chat' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    AI 채팅
                </button>
                <button
                    onClick={() => setActiveTab('summarize')}
                    style={{
                        padding: '10px 15px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'summarize' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'summarize' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    리뷰 요약
                </button>
                <button
                    onClick={() => setActiveTab('sentiment')}
                    style={{
                        padding: '10px 20px',
                        marginRight: '10px',
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'sentiment' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'sentiment' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px',
                    }}
                >
                    감성 분석
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                {activeTab === 'chat' && <AiChat />}
                {activeTab === 'summarize' && <AiReviewSummarize />}
                {activeTab === 'sentiment' && <AiSentimentAnalysis />}
            </div>

            <button
                onClick={onRequestClose}
                style={{
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    float: 'right'
                }}
            >
                닫기
            </button>
        </Modal>
    );
};

export default AiModal;