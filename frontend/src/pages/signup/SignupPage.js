import React from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupForm from './hooks/useSignupForm';

import '../../assets/css/SignupForm.css';
import StatusMessage from './components/StatusMessage';
import IdNicknameInputGroup1 from './components/IdNicknameInputGroup';
import InputField1 from './components/InputField';
import PasswordConfirmField1 from './components/PasswordConfirmField';
import EmailVerificationGroup1 from './components/EmailVerificationGroup'; 
import TextAreaField1 from './components/TextAreaField';

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
    handleVerificationCodeChange,
    handleSendVerificationCode, 
    handleVerifyEmailCode,      
    checkDuplicate,
    handleSubmit, 
  } = useSignupForm(navigate);

  return (
    <div className="signup-container1">
      <h2>회원가입</h2>
      {messages.general && <StatusMessage type={messages.general.includes('성공') ? 'success' : 'error'} message={messages.general} />}

      <form onSubmit={handleSubmit}>
        <IdNicknameInputGroup1
          label="아이디:"
          id="userLoginId"
          name="userLoginId"
          value={formData.userLoginId}
          onChange={handleChange}
          onBlur={() => checkDuplicate('login-id', formData.userLoginId)}
          onClickCheck={() => checkDuplicate('login-id', formData.userLoginId)}
          isDuplicate={duplicateStatus.userLoginId}
          fieldMessage={messages.userLoginId}
        />

        <InputField1
          label="비밀번호:"
          id="userPassword"
          name="userPassword"
          type="password"
          value={formData.userPassword}
          onChange={handleChange}
          required
        />

        <PasswordConfirmField1
          label="비밀번호 확인:"
          id="userPasswordConfirm"
          name="userPasswordConfirm"
          value={formData.userPasswordConfirm}
          onChange={handleChange}
          userPassword={formData.userPassword}
          required
        />
        
        <EmailVerificationGroup1
          userEmail={formData.userEmail}
          verificationCode={verificationCode}
          emailVerified={emailVerified}
          emailSent={emailSent}
          handleEmailChange={handleChange}
          handleVerificationCodeChange={handleVerificationCodeChange}
          handleSendVerificationCode={handleSendVerificationCode}
          handleVerifyEmailCode={handleVerifyEmailCode}
          checkDuplicateEmail={() => checkDuplicate('email', formData.userEmail)}
          emailFieldMessage={messages.userEmail}
          verificationCodeFieldMessage={messages.verificationCode}
          emailStatusMessage={messages.emailStatus}
        />

        <IdNicknameInputGroup1
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

        <InputField1
          label="이름:"
          id="userUsername"
          name="userUsername"
          type="text"
          value={formData.userUsername}
          onChange={handleChange}
          required
        />

        <InputField1
          label="프로필 이미지 URL (선택 사항):"
          id="userProfileImageUrl"
          name="userProfileImageUrl"
          type="text"
          value={formData.userProfileImageUrl}
          onChange={handleChange}
        />

        <TextAreaField1
          label="자기소개 (선택 사항):"
          id="userBio"
          name="userBio"
          value={formData.userBio}
          onChange={handleChange}
        />

        <button type="submit" className="btn-submit1">회원가입</button>
      </form>
    </div>
  );
}

export default SignupPage;
