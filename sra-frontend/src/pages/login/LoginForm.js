import React from 'react';
import '../../assets/css/LoginForm.css';
import AppLogo from './components/AppLogo';
import LoginFormComponent from './components/LoginFormComponent';
import LoginFormLinks from './components/LoginFormLinks';
import IntroButton from './components/IntroButton';
import useLogin from './hooks/useLogin';

function LoginForm({ onLoginSuccess }) {
  const {
    credential,
    setCredential,
    password,
    setPassword,
    handleSubmit,
  } = useLogin(onLoginSuccess);

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
      <LoginFormLinks />
      <IntroButton />
    </div>
  );
}

export default LoginForm;