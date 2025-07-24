// src/pages/signup/SignupPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useSignupForm from './hooks/useSignupForm';

import '../../assets/css/SignupForm.css';
import StatusMessage from './components/StatusMessage';
import IdNicknameInputGroup1 from './components/IdNicknameInputGroup';
import InputField1 from './components/InputField';
import PasswordConfirmField1 from './components/PasswordConfirmField';
import EmailVerificationGroup1 from './components/EmailVerificationGroup';
import TextAreaField1 from './components/TextAreaField';
import TermsAndPrivacyModal from './components/TermsAndPrivacyModal';

// onSignupSuccess prop을 추가합니다.
function SignupPage({ onCloseModal, onSignupSuccess }) {
  const navigate = useNavigate();
  const {
    formData,
    verificationCode,
    emailVerified,
    emailSent,
    messages,
    duplicateStatus,
    agreements,
    handleChange,
    handleImageChange,
    handleVerificationCodeChange,
    handleSendVerificationCode,
    handleVerifyEmailCode,
    checkDuplicate,
    handleAgreementChange,
    handleSubmit,
  } = useSignupForm(onSignupSuccess);

  const [requiredFieldsFilled, setRequiredFieldsFilled] = useState(false);
  const [idChecked, setIdChecked] = useState(false);
  const [nickChecked, setNickChecked] = useState(false);
  const [emailChecked, setEmailChecked] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  useEffect(() => {
    const requiredFields = [
      formData.userLoginId,
      formData.userPassword,
      formData.userPasswordConfirm,
      formData.userEmail,
      formData.userNickname,
      formData.userName,
    ];
    const allFilled = requiredFields.every((field) => field && field.trim() !== '');
    setRequiredFieldsFilled(allFilled);
  }, [formData]);

  const isSubmitEnabled =
    agreements.termsAndPrivacy &&
    requiredFieldsFilled &&
    idChecked &&
    nickChecked &&
    emailChecked &&
    duplicateStatus.userLoginId === false &&
    duplicateStatus.userNickname === false &&
    duplicateStatus.userEmail === false &&
    emailVerified &&
    !messages.userPassword && // 비밀번호 유효성 메시지가 없어야 제출 가능
    !messages.userPasswordConfirm; // 비밀번호 확인 메시지가 없어야 제출 가능

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!isSubmitEnabled) {
      alert('모든 필수 항목, 약관 동의, 중복/인증 확인, 비밀번호 유효성 검사를 완료해야 합니다.');
      return;
    }
    await handleSubmit(e);
  };

  const handleTermsAndPrivacyClick = (e) => {
    e.preventDefault();
    setShowTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setShowTermsModal(false);
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
          onBlur={() => {
            checkDuplicate('login-id', formData.userLoginId);
            setIdChecked(true);
          }}
          onClickCheck={() => {
            checkDuplicate('login-id', formData.userLoginId);
            setIdChecked(true);
          }}
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
        {messages.userPassword && <StatusMessage type="error" message={messages.userPassword} />} {/* 비밀번호 유효성 메시지 표시 */}

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
          handleSendVerificationCode={() => {
            handleSendVerificationCode();
            setEmailChecked(true);
          }}
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
          onBlur={() => {
            checkDuplicate('nickname', formData.userNickname);
            setNickChecked(true);
          }}
          onClickCheck={() => {
            checkDuplicate('nickname', formData.userNickname);
            setNickChecked(true);
          }}
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
          <label htmlFor="userProfImg">프로필 이미지 (선택 사항):</label>
          <input
            type="file"
            id="userProfImg"
            name="userProfImg"
            accept="image/*"
            onChange={handleImageChange}
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

        <div className="agreement-group" style={{ marginBottom: '20px', fontSize: '14px', color: '#ddd' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', cursor: 'pointer' }}>
            <input
              type="checkbox"
              name="termsAndPrivacy"
              checked={agreements.termsAndPrivacy}
              onChange={handleAgreementChange}
              style={{ width: '16px', height: '16px', cursor: 'pointer' }}
            />
            서비스 이용약관 및 개인정보 처리방침에 동의합니다.{' '}
            <a href="#" onClick={handleTermsAndPrivacyClick} style={{ color: '#79AAFF', textDecoration: 'underline', fontWeight: '600' }}>
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
            backgroundColor: isSubmitEnabled ? '#FFCC00' : '#444',
            color: isSubmitEnabled ? '#000' : '#aaa',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '20px',
            fontWeight: 'bold',
            transition: 'background-color 0.3s ease',
          }}
        >
          회원가입
        </button>
      </form>

      {/* 약관 모달 */}
      {showTermsModal && <TermsAndPrivacyModal onClose={handleCloseTermsModal} />}
    </div>
  );
}

export default SignupPage;