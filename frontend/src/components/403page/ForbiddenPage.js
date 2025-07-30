// src/components/403page/ForbiddenPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ForbiddenPage.css'; // 필요하다면 CSS 파일 생성

function ForbiddenPage() {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1); // 이전 페이지로 이동
    };

    const handleGoHome = () => {
        navigate('/'); // 홈 페이지로 이동
    };

    return (
        <div className="forbidden-page-container">
            <h1 className="forbidden-page-title">403 Forbidden</h1>
            <p className="forbidden-page-message">
                접근 권한이 없습니다. 이 페이지를 보려면 로그인이 필요합니다.
            </p>
            <div className="forbidden-page-actions">
                <button onClick={handleGoBack} className="forbidden-page-button">
                    이전 페이지로 돌아가기
                </button>
                <button onClick={handleGoHome} className="forbidden-page-button">
                    홈으로 이동
                </button>
            </div>
        </div>
    );
}

export default ForbiddenPage;