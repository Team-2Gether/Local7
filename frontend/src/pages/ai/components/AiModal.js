import React, { useState } from 'react';
import Modal from 'react-modal';

import AiChat from './AiChat';
import './AiModal.css'


Modal.setAppElement('#root');

const AiModal = ({ isOpen, onRequestClose }) => {
    const [activeTab, setActiveTab] = useState('chat'); 

    return (
    <Modal
        isOpen={isOpen}
        onRequestClose={onRequestClose}
        contentLabel="AI 기능 모달"
        className="AiModal__content"
        overlayClassName="AiModal__overlay"
    >
        <h2>AI R7봇 채팅</h2>

        <div className="AiModal__chat-container">
            {activeTab === 'chat' && <AiChat />}
        </div>

        <button
            onClick={onRequestClose}
            className="AiModal__close-button"
        >
            닫기
        </button>
    </Modal>
);
};

export default AiModal;