import React from 'react';
import './NotFoundPage.css';

function NotFoundPage() {
    return (
        <div className="not-found-container">
            <h1>404</h1>
            <p>페이지를 찾을 수 없습니다.</p>
            <p>요청하신 페이지가 존재하지 않거나, 사용할 수 없는 페이지입니다.</p>
            <a href="/" className="home-button">홈으로 돌아가기</a>
        </div>
    );
}

export default NotFoundPage;