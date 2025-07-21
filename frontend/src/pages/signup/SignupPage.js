import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupForm from './hooks/useSignupForm';

import '../../assets/css/SignupForm.css'; // 리액트 css 경로
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
    handleImageChange, // 추가
    handleVerificationCodeChange,
    handleSendVerificationCode,
    handleVerifyEmailCode,
    checkDuplicate,
    handleSubmit,
  } = useSignupForm(navigate);

  // 약관 동의 상태 (필수 2개, 선택 1개)
  const [agreements, setAgreements] = useState({
    termsOfService: false,
    privacyPolicy: false,
    marketingConsent: false,
  });

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  // 필수 약관 체크 여부
  const isSubmitEnabled = agreements.termsOfService && agreements.privacyPolicy;

  const onSubmit = (e) => {
    if (!isSubmitEnabled) {
      e.preventDefault();
      alert('서비스 이용약관과 개인정보 처리방침에 반드시 동의해야 합니다.');
      return;
    }
    handleSubmit(e);
  };

  return (
    <div className="signup-container1">
      <h2>회원가입</h2>
      {messages.general && (
        <StatusMessage
          type={messages.general.includes('성공') ? 'success' : 'error'}
          message={messages.general}
        />
      )}

      <form onSubmit={onSubmit}>
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
          id="userName"
          name="userName"
          type="text"
          value={formData.userName}
          onChange={handleChange}
          required
        />

        <div>
          {/* 이미지 업로드 관련 div */}
          <label htmlFor="userProfImg">프로필 이미지 (선택 사항):</label>
          <input
            type="file"
            id="userProfImg"
            name="userProfImg"
            accept="image/*"
            onChange={handleImageChange} // handleImageChange 연결
          />
          {formData.userProfImgUrl && (
            <img
              src={formData.userProfImgUrl}
              alt="프로필 미리보기"
              style={{ maxWidth: '100px', maxHeight: '100px', marginTop: '10px' }}
            />
          )}
        </div>

        <TextAreaField1
          label="자기소개 (선택 사항):"
          id="userBio"
          name="userBio"
          value={formData.userBio}
          onChange={handleChange}
        />

        {/* 약관 동의 체크박스 */}
        <div className="agreement-group" style={{ marginBottom: '20px', fontSize: '14px', color: '#ddd' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="termsOfService"
              checked={agreements.termsOfService}
              onChange={handleAgreementChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            서비스 이용약관에 동의합니다.{' '}
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#79AAFF', textDecoration: 'underline', fontWeight: '600' }}>
              자세히 보기
            </a>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="privacyPolicy"
              checked={agreements.privacyPolicy}
              onChange={handleAgreementChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            개인정보 처리방침에 동의합니다.{' '}
            <a href="/privacy" target="_blank" rel="noopener noreferrer" style={{ color: '#79AAFF', textDecoration: 'underline', fontWeight: '600' }}>
              자세히 보기
            </a>
          </label>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="marketingConsent"
              checked={agreements.marketingConsent}
              onChange={handleAgreementChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            마케팅 정보 수신에 동의합니다. (선택)
          </label>
        </div>

        <button
          type="submit"
          className="btn-submit1"
          disabled={!isSubmitEnabled}
          style={{
            cursor: isSubmitEnabled ? 'pointer' : 'not-allowed',
            opacity: isSubmitEnabled ? 1 : 0.6,
          }}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default SignupPage;
