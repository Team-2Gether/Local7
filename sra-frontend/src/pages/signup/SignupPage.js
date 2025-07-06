import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupForm from './hooks/useSignupForm';

import '../../assets/css/SignupForm.css';
import StatusMessage from './components/StatusMessage';
import IdNicknameInputGroup from './components/IdNicknameInputGroup';
import InputField from './components/InputField';
import PasswordConfirmField from './components/PasswordConfirmField';
import EmailVerificationGroup from './components/EmailVerificationGroup.js';
import TextAreaField from './components/TextAreaField.js';

function SignupPage() {
  const navigate = useNavigate();
  const {
    formData,
    verificationCode,
    emailVerified,
    emailSent,
    messages,
    duplicateStatus,
    handleChange,
    handleEmailChange,
    handleVerificationCodeChange,
    handleSendVerificationCode,
    handleVerifyEmailCode,
    checkDuplicate,
    handleSubmit: submitForm,
    resetFormAndStates
  } = useSignupForm(navigate);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await submitForm(e);
    if (success) {
      alert('회원가입 성공!');
      // resetFormAndStates(); // 리다이렉션 시 컴포넌트 언마운트되므로 별도로 호출할 필요 없음
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      {messages.general && <StatusMessage type={messages.general.includes('성공') ? 'success' : 'error'} message={messages.general} />}

      <form onSubmit={handleSubmit}>
        <IdNicknameInputGroup
          label="아이디:"
          id="userLoginId"
          name="userLoginId"
          value={formData.userLoginId}
          onChange={handleChange}
          onBlur={() => checkDuplicate('login-id', formData.userLoginId)}
          onClickCheck={() => checkDuplicate('login-id', formData.userLoginId)}
          isDuplicate={duplicateStatus.userLoginId}
          fieldMessage={messages['login-id']}
        />

        <InputField
          label="비밀번호:"
          id="userPassword"
          name="userPassword"
          type="password"
          value={formData.userPassword}
          onChange={handleChange}
          required
        />

        <PasswordConfirmField
          label="비밀번호 확인:"
          id="userPasswordConfirm"
          name="userPasswordConfirm"
          value={formData.userPasswordConfirm}
          onChange={handleChange}
          userPassword={formData.userPassword}
          required
        />

        <EmailVerificationGroup
          userEmail={formData.userEmail}
          verificationCode={verificationCode}
          emailVerified={emailVerified}
          emailSent={emailSent}
          handleEmailChange={handleEmailChange}
          handleVerificationCodeChange={handleVerificationCodeChange}
          handleSendVerificationCode={handleSendVerificationCode}
          handleVerifyEmailCode={handleVerifyEmailCode}
          checkDuplicateEmail={() => checkDuplicate('email', formData.userEmail)}
          emailFieldMessage={messages.userEmail}
          verificationCodeFieldMessage={messages.verificationCode}
          emailStatusMessage={messages.emailStatus}
        />

        <IdNicknameInputGroup
          label="닉네임:"
          id="userNickname"
          name="userNickname"
          value={formData.userNickname}
          onChange={handleChange}
          onBlur={() => checkDuplicate('nickname', formData.userNickname)}
          onClickCheck={() => checkDuplicate('nickname', formData.userNickname)}
          isDuplicate={duplicateStatus.userNickname}
          fieldMessage={messages.nickname}
        />

        <InputField
          label="이름:"
          id="userUsername"
          name="userUsername"
          type="text"
          value={formData.userUsername}
          onChange={handleChange}
          required
        />

        <InputField
          label="프로필 이미지 URL (선택 사항):"
          id="userProfileImageUrl"
          name="userProfileImageUrl"
          type="text"
          value={formData.userProfileImageUrl}
          onChange={handleChange}
        />

        <TextAreaField
          label="자기소개 (선택 사항):"
          id="userBio"
          name="userBio"
          value={formData.userBio}
          onChange={handleChange}
        />

        <button type="submit" className="btn-submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;