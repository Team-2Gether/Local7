// src/pages/login/LoginForm.js
import React from 'react';
import '../../assets/css/LoginForm.css';
import AppLogo from './components/AppLogo';
import LoginFormComponent from './components/LoginFormComponent';
import LoginFormLinks from './components/LoginFormLinks';
import useLogin from './hooks/useLogin';

// onOpenSignupModal, onOpenForgetIdPwdModal props 추가
function LoginForm({ onLoginSuccess, onCloseModal, onOpenTermsModal, onOpenSignupModal, onOpenForgetIdPwdModal }) {
  const {
    credential,
    setCredential,
    password,
    setPassword,
    handleSubmit,
  } = useLogin(onLoginSuccess);

  const handleGoogleLogin = () => {
    // Spring Boot의 Google OAuth2 시작 엔드포인트로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  };

  const handleKakaoLogin = () => {
    // Spring Boot의 Kakao OAuth2 시작 엔드포인트로 리다이렉트
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="login-form-container">
      <AppLogo />
      <LoginFormComponent
        credential={credential}
        setCredential={setCredential}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      {/* 새로 추가된 props 전달 */}
      <LoginFormLinks
        onCloseModal={onCloseModal}
        onOpenTermsModal={onOpenTermsModal}
        onOpenSignupModal={onOpenSignupModal}
        onOpenForgetIdPwdModal={onOpenForgetIdPwdModal}
      />

      {/* 소셜 로그인 버튼 추가 */}
      <div className="social-login-section">
        <button className="google-login-button" onClick={handleGoogleLogin}>
          Google로 로그인
        </button>
        <button className="kakao-login-button" onClick={handleKakaoLogin}>
          카카오로 로그인
        </button>
      </div>
    </div>
  );
}

export default LoginForm;