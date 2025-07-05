import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar'; // Sidebar 컴포넌트 임포트
import AiModal from '../ai/components/AiModal'; // AiModal 임포트

const DashboardPage = () => {
    const [activeContent, setActiveContent] = useState('home'); // 현재 활성화된 콘텐츠 (home, add, mypage 등)
    const [isAiModalOpen, setIsAiModalOpen] = useState(false); // AI 모달 상태

    const handleSidebarClick = (item) => {
        if (item === 'ai') {
            setIsAiModalOpen(true); // AI 버튼 클릭 시 모달 열기
        } else {
            setActiveContent(item); // 다른 버튼 클릭 시 콘텐츠 변경
            setIsAiModalOpen(false); // 혹시 열려있을 AI 모달 닫기
        }
    };

    const renderMainContent = () => {
        switch (activeContent) {
            case 'home':
                return <div><h2>홈 페이지 콘텐츠</h2><p>환영합니다! 최신 맛집 정보와 피드를 확인하세요.</p></div>;
            case 'add':
                return <div><h2>새 게시물 추가</h2><p>새로운 맛집 리뷰를 작성해보세요.</p></div>;
            case 'mypage':
                return <div><h2>마이 페이지</h2><p>내 프로필, 저장된 맛집, 활동 내역을 관리합니다.</p></div>;
            default:
                return <div><h2>홈 페이지 콘텐츠</h2><p>환영합니다! 최신 맛집 정보와 피드를 확인하세요.</p></div>;
        }
    };

    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            {/* Sidebar 컴포넌트에 클릭 핸들러 전달 */}
            <Sidebar onMenuItemClick={handleSidebarClick} />

            {/* 메인 콘텐츠 영역 */}
            <div style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
                {renderMainContent()}
            </div>

            {/* AI 모달 */}
            <AiModal
                isOpen={isAiModalOpen}
                onRequestClose={() => setIsAiModalOpen(false)}
            />
        </div>
    );
};

export default DashboardPage;