import React from 'react';
import InputField from './InputField';
import AuthButton from './AuthButton';
import StatusMessage from './StatusMessage';

function EmailVerificationGroup({
  userEmail,
  verificationCode,
  emailVerified,
  emailSent,
  handleEmailChange,
  handleVerificationCodeChange,
  handleSendVerificationCode,
  handleVerifyEmailCode,
  checkDuplicateEmail,
  emailFieldMessage,
  verificationCodeFieldMessage,
  emailStatusMessage
}) {
  return (
    <div className="form-group1">
      <label htmlFor="userEmail">이메일:</label>
      <div className="email-input-group1">
        <InputField
          id="userEmail"
          name="userEmail"
          type="email"
          value={userEmail}
          onChange={handleEmailChange}
          onBlur={checkDuplicateEmail}
          required
          disabled={emailVerified}
          label=""
        />
        {!emailVerified && (
          <AuthButton
            onClick={handleSendVerificationCode}
            disabled={emailSent || !userEmail}
            className="btn-send-code1"
          >
            {emailSent ? '재전송' : '인증코드 전송'}
          </AuthButton>
        )}
      </div>
      {emailFieldMessage && <StatusMessage type="error" message={emailFieldMessage} />}
      {emailStatusMessage === 'pending' && <StatusMessage type="info" message="인증 코드가 전송되었습니다. 이메일을 확인해주세요." />}
      {emailStatusMessage === 'verified' && <StatusMessage type="success" message="이메일이 인증되었습니다!" />}
      {emailStatusMessage === 'failed' && <StatusMessage type="error" message="이메일 인증에 실패했습니다." />}

      {emailSent && !emailVerified && (
        <div className="form-group1">
          <label htmlFor="verificationCode">인증 코드 (4자리):</label>
          <div className="email-input-group1">
            <input
              type="text"
              id="verificationCode"
              name="verificationCode"
              value={verificationCode}
              onChange={handleVerificationCodeChange}
              maxLength="4"
              required
            />
            <button type="button" onClick={handleVerifyEmailCode} className="btn-verify-code1">
              인증 확인
            </button>
          </div>
          {verificationCodeFieldMessage && <StatusMessage type="error" message={verificationCodeFieldMessage} />}
        </div>
      )}
    </div>
  );
}

export default EmailVerificationGroup;
