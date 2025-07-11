import React from 'react';
import '../../assets/css/LoginForm.css';
import AppLogo from './components/AppLogo';
import LoginFormComponent from './components/LoginFormComponent';
import LoginFormLinks from './components/LoginFormLinks';
import useLogin from './hooks/useLogin';

function LoginForm({ onLoginSuccess, onCloseModal, onOpenTermsModal }) { // onOpenTermsModal prop 추가
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
      <LoginFormLinks onCloseModal={onCloseModal} onOpenTermsModal={onOpenTermsModal} /> {/* onOpenTermsModal prop 전달 */}
    </div>
  );
}

export default LoginForm;