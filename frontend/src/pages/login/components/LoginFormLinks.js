// src/pages/login/components/LoginFormLinks.js
import React from 'react';
import { Link } from 'react-router-dom'; 

function LoginFormLinks({ onCloseModal, onOpenTermsModal }) { 
  const handleSignupClick = () => {
    // 모달을 닫는 함수 호출 (onCloseModal이 유효한 경우에만)
    if (onCloseModal) {
      onCloseModal();
    }
    // Link 컴포넌트 자체의 to="/signup" 동작은 자동으로 처리됩니다.
  };

  const handleTermsClick = () => {
    if (onCloseModal) {
      onCloseModal(); // 이용약관 링크 클릭 시 로그인 모달 닫기
    }
    if (onOpenTermsModal) {
      onOpenTermsModal(); // 이용약관 모달 열기
    }
  };

  return (
    <div className="links-container">
      <Link to="/signup" onClick={handleSignupClick}>회원 가입</Link>
      <Link to="#">비밀번호 변경</Link> 
      <Link to="#" onClick={handleTermsClick}>Terms</Link> {/* Terms 링크 핸들러 변경 */}
    </div>
  );
}

export default LoginFormLinks;