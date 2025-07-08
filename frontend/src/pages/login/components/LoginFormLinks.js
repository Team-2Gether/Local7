// src/pages/login/components/LoginFormLinks.js
import React from 'react';
import { Link } from 'react-router-dom'; 

function LoginFormLinks({ onCloseModal }) {
  const handleSignupClick = () => {
    // 모달을 닫는 함수 호출 (onCloseModal이 유효한 경우에만)
    if (onCloseModal) {
      onCloseModal();
    }
    // Link 컴포넌트 자체의 to="/signup" 동작은 자동으로 처리됩니다.
  };

  return (
    <div className="links-container">
      <Link to="/signup" onClick={handleSignupClick}>회원 가입</Link>
      <Link to="#">비밀번호 변경</Link> 
      <Link to="#">이용 약관</Link> 
    </div>
  );
}

export default LoginFormLinks;