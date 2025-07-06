// src/pages/signup/hooks/useEmailVerification.js
import { useState } from 'react';
import {
  sendEmailVerificationCode as apiSendEmailVerificationCode, // 이름 변경
  verifyEmailCode as apiVerifyEmailCode // 이름 변경
} from '../../../api/SignupApi';

const useEmailVerification = (userEmail, setMessages) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    setMessages((prev) => ({ ...prev, verificationCode: '' }));
  };

  const sendVerificationCode = async () => { 
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs.userEmail;
      delete newMsgs.general;
      delete newMsgs.emailStatus;
      delete newMsgs.verificationCode;
      return newMsgs;
    });

    if (!userEmail) {
      setMessages((prev) => ({ ...prev, userEmail: '이메일을 입력해주세요.' }));
      return false;
    }

    try {
      // 변경된 API 함수 이름 사용
      const response = await apiSendEmailVerificationCode(userEmail); 
      if (response.status === 'success') {
        setMessages((prev) => ({ ...prev, general: response.message, emailStatus: 'pending' }));
        setEmailSent(true);
        return true;
      } else {
        setMessages((prev) => ({ ...prev, general: response.message }));
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '인증 코드 전송 중 오류가 발생했습니다.';
      setMessages((prev) => ({ ...prev, general: errorMessage }));
      return false;
    }
  };

  const verifyEmailCode = async () => { // 훅 내부의 함수
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs.verificationCode;
      delete newMsgs.general;
      return newMsgs;
    });

    if (!verificationCode) {
      setMessages((prev) => ({ ...prev, verificationCode: '인증 코드를 입력해주세요.' }));
      return false;
    }

    try {
      // 변경된 API 함수 이름 사용
      const response = await apiVerifyEmailCode(userEmail, verificationCode);
      if (response.status === 'success') {
        setMessages((prev) => ({ ...prev, general: response.message, emailStatus: 'verified' }));
        setEmailVerified(true);
        return true;
      } else {
        setMessages((prev) => ({ ...prev, general: response.message, emailStatus: 'failed' }));
        setEmailVerified(false);
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.';
      setMessages((prev) => ({ ...prev, general: errorMessage, emailStatus: 'failed' }));
      setEmailVerified(false);
      return false;
    }
  };

  const resetEmailVerification = () => {
    setVerificationCode('');
    setEmailVerified(false);
    setEmailSent(false);
    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages.userEmail;
      delete newMessages.verificationCode;
      delete newMessages.emailStatus;
      return newMessages;
    });
  };

  return {
    verificationCode,
    emailVerified,
    emailSent,
    handleVerificationCodeChange,
    sendVerificationCode,
    verifyEmailCode, 
    resetEmailVerification,
  };
};

export default useEmailVerification;