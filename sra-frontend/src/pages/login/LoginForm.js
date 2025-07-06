import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLogin from './hooks/useLogin'; // useLogin 훅 경로
import AppLogo from './components/AppLogo'; // AppLogo 컴포넌트 경로
import LoginFormLinks from './components/LoginFormLinks'; // LoginFormLinks 컴포넌트 경로
import IntroButton from './components/IntroButton'; // IntroButton 컴포넌트 경로
import LoginFormComponent from './components/LoginFormComponent'; // LoginFormComponent 컴포넌트 경로
import '../../assets/css/LoginForm.css';

function LoginForm({ onLoginSuccess }) {
  const navigate = useNavigate(); // 이 부분에 '줄'이 나타나는 것으로 보입니다.
  const { credential, setCredential, password, setPassword, handleSubmit } = useLogin(onLoginSuccess);

  return (
    <div className="login-form-container">
      <AppLogo /> {/* AppLogo 컴포넌트 사용 */}

      <LoginFormComponent
        credential={credential}
        setCredential={setCredential}
        password={password}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      /> {/* LoginFormComponent 사용 */}

      <LoginFormLinks /> {/* LoginFormLinks 컴포넌트 사용 */}

      <IntroButton /> {/* IntroButton 컴포넌트 사용 */}
    </div>
  );
}

export default LoginForm;