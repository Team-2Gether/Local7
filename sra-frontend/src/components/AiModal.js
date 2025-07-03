import React, { useState } from 'react';
import Modal from 'react-modal'; // react-modal 라이브러리 임포트
import { chatWithAi, summarizeReview, extractKeywords } from '../api/aiApi';  // extractKeywords 함수 임포트

// 모달의 접근성을 위한 설정
Modal.setAppElement('#root'); // #root는 React 앱의 기본 DOM 요소 ID

const AiModal = ({ isOpen, onRequestClose }) => {
    // 'chat', 'summarize', 'extract' 탭 추가
    const [activeTab, setActiveTab] = useState('chat'); 
    
    // 채팅 기능 상태
    const [chatInput, setChatInput] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [isChatLoading, setIsChatLoading] = useState(false);

    // 요약 기능 상태
    const [reviewInput, setReviewInput] = useState('');
    const [reviewSummary, setReviewSummary] = useState('');
    const [reviewKeywords, setReviewKeywords] = useState([]);
    const [isReviewLoading, setIsReviewLoading] = useState(false);

    // 키워드 추출 기능 상태
    const [keywordInput, setKeywordInput] = useState('');
    const [extractedKeywords, setExtractedKeywords] = useState([]);
    const [isKeywordLoading, setIsKeywordLoading] = useState(false);


    // 채팅 메시지 전송 핸들러
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

    // 리뷰 요약 요청 핸들러
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

    // ⭐ 키워드 추출 요청 핸들러
    const handleExtractKeywordsSubmit = async () => {
        if (!keywordInput.trim()) return;
        setIsKeywordLoading(true);
        setExtractedKeywords([]); // 이전 키워드 초기화
        try {
            const { keywords } = await extractKeywords(keywordInput);
            setExtractedKeywords(keywords);
        } catch (error) {
            setExtractedKeywords(['키워드 추출에 실패했습니다.']);
            console.error(error); 
        } finally {
            setIsKeywordLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onRequestClose}
            contentLabel="AI 기능 모달"
            style={{
                overlay: {
                    backgroundColor: 'rgba(0, 0, 0, 0.75)'
                },
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
                {/* 키워드 추출 탭 버튼 추가 */}
                <button 
                    onClick={() => setActiveTab('extract')} 
                    style={{ 
                        padding: '10px 15px', 
                        cursor: 'pointer',
                        backgroundColor: activeTab === 'extract' ? '#007bff' : '#f0f0f0',
                        color: activeTab === 'extract' ? 'white' : 'black',
                        border: 'none',
                        borderRadius: '5px'
                    }}
                >
                    키워드 추출
                </button>
            </div>

            <div style={{ marginTop: '20px' }}>
                {activeTab === 'chat' && (
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
                )}

                {activeTab === 'summarize' && (
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
                )}

                {/* 키워드 추출 탭 내용 추가 */}
                {activeTab === 'extract' && (
                    <div>
                        <h3>키워드 추출</h3>
                        <textarea
                            value={keywordInput}
                            onChange={(e) => setKeywordInput(e.target.value)}
                            placeholder="키워드를 추출할 텍스트를 입력하세요..."
                            rows="6"
                            style={{ width: '100%', padding: '10px', boxSizing: 'border-box', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                        <button 
                            onClick={handleExtractKeywordsSubmit} 
                            disabled={isKeywordLoading}
                            style={{ 
                                padding: '10px 20px', 
                                backgroundColor: '#28a745', 
                                color: 'white', 
                                border: 'none', 
                                borderRadius: '5px', 
                                cursor: 'pointer' 
                            }}
                        >
                            {isKeywordLoading ? '추출 중...' : '키워드 추출'}
                        </button>
                        {extractedKeywords.length > 0 && (
                            <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e9ecef', borderRadius: '5px' }}>
                                <h4>추출된 키워드:</h4>
                                <p>{extractedKeywords.join(', ')}</p>
                            </div>
                        )}
                    </div>
                )}
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