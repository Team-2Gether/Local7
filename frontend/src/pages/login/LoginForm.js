// src/pages/login/LoginForm.js (기존 LoginForm.js에 추가)
import React from 'react';
import '../../assets/css/LoginForm.css'; //
import AppLogo from './components/AppLogo'; //
import LoginFormComponent from './components/LoginFormComponent'; //
import LoginFormLinks from './components/LoginFormLinks'; //
import useLogin from './hooks/useLogin'; //

function LoginForm({ onLoginSuccess, onCloseModal, onOpenTermsModal }) { // onOpenTermsModal prop 추가
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
      <LoginFormLinks onCloseModal={onCloseModal} onOpenTermsModal={onOpenTermsModal} /> {/* onOpenTermsModal prop 전달 */}

      {/* Google 로그인 버튼 추가 */}
      <div className="social-login-section">
        <button className="google-login-button" onClick={handleGoogleLogin}>
          Google로 로그인
        </button>
      </div>
    </div>
  );
}

export default LoginForm;