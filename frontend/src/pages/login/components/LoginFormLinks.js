// src/pages/login/components/LoginFormLinks.js
import React from 'react';
// Link는 더 이상 사용하지 않으므로 제거합니다.
// import { Link } from 'react-router-dom';

// 새로 추가된 props (onOpenSignupModal, onOpenForgetIdPwdModal)를 받습니다.
function LoginFormLinks({ onCloseModal, onOpenTermsModal, onOpenSignupModal, onOpenForgetIdPwdModal }) {
  const handleSignupClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    if (onOpenSignupModal) {
      onOpenSignupModal(); // 회원가입 모달 열기
    }
    // onCloseModal은 AppContent에서 openSignupModal/openForgetIdPwdModal이 처리합니다.
  };

  const handleForgetIdPwdClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    if (onOpenForgetIdPwdModal) {
      onOpenForgetIdPwdModal(); // 비밀번호 찾기 모달 열기
    }
    // onCloseModal은 AppContent에서 openSignupModal/openForgetIdPwdModal이 처리합니다.
  };

  const handleTermsClick = (e) => {
    e.preventDefault(); // 기본 링크 동작 방지
    if (onOpenTermsModal) {
      onOpenTermsModal(); // 이용약관 모달 열기
    }
  };

  return (
    <div className="links-container">
<<<<<<< HEAD
      <a href="#" onClick={handleSignupClick}>회원 가입</a>
      <a href="#" onClick={handleForgetIdPwdClick}>비밀번호 변경</a>
=======
      <a href="#" onClick={handleSignupClick}>회원 가입</a> {/* a 태그로 변경 및 onClick 핸들러 적용 */}
      <a href="#" onClick={handleForgetIdPwdClick}>비밀번호 변경</a> {/* a 태그로 변경 및 onClick 핸들러 적용 */}
>>>>>>> 65fde1bb90e5b2fcbac0237dc31af7f009294216
      <a href="#" onClick={handleTermsClick}>이용약관</a>
    </div>
  );
}

export default LoginFormLinks;