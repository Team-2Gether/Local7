// src/pages/signup/hooks/useSignupForm.js
import { useState } from 'react';
import axios from 'axios';
import useFormData from './useFormData';
import useEmailVerification from './useEmailVerification';
import useDuplicateCheck from './useDuplicateCheck';

function useSignupForm(navigate) {
  const initialFormData = {
    userLoginId: '',
    userPassword: '',
    userPasswordConfirm: '',
    userEmail: '',
    userNickname: '',
    userUsername: '',
    userProfileImageUrl: '',
    userBio: '',
  };

  const [messages, setMessages] = useState({});

  const { formData, handleChange: handleFormDataChange, resetFormData } = useFormData(initialFormData);
  
  const {
    verificationCode,
    emailVerified,
    emailSent,
    handleVerificationCodeChange,
    sendVerificationCode,
    verifyEmailCode,
    resetEmailVerification,
  } = useEmailVerification(formData.userEmail, setMessages);

  const { duplicateStatus, checkDuplicate, resetDuplicateStatus, setDuplicateStatus } = useDuplicateCheck(setMessages); // setDuplicateStatus 구조 분해 할당

  const handleAllChanges = (e) => {
    const { name } = e.target;
    handleFormDataChange(e);

    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages[name];
      if (name === 'userEmail') {
        delete newMessages.emailStatus;
        delete newMessages.verificationCode;
      }
      if (name === 'userLoginId' || name === 'userNickname' || name === 'userEmail') {
        delete newMessages.general;
      }
      return newMessages;
    });

    // Reset duplicate status for the changed field using setDuplicateStatus
    if (name === 'userLoginId') setDuplicateStatus(prev => ({ ...prev, userLoginId: null }));
    if (name === 'userNickname') setDuplicateStatus(prev => ({ ...prev, userNickname: null }));
    if (name === 'userEmail') setDuplicateStatus(prev => ({ ...prev, userEmail: null }));

    if (name === 'userEmail') {
      resetEmailVerification();
    }
  };

  const handleCheckDuplicate = async (field, value) => {
    setMessages(prev => {
        const newMsgs = {...prev};
        delete newMsgs.general;
        return newMsgs;
    });
    return checkDuplicate(field, value, true);
  };

  const handleSendCode = async () => {
    setMessages(prev => {
        const newMsgs = {...prev};
        delete newMsgs.userEmail;
        delete newMsgs.general;
        delete newMsgs.emailStatus;
        return newMsgs;
    });
    const isEmailDup = await checkDuplicate('email', formData.userEmail, false);
    if (isEmailDup) {
      setMessages(prev => ({ ...prev, general: '이미 사용 중인 이메일입니다. 다른 이메일을 사용해주세요.' }));
      return;
    }
    await sendVerificationCode();
  };

  const resetFormAndStates = () => {
    resetFormData();
    resetEmailVerification();
    resetDuplicateStatus();
    setMessages({});
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setMessages({});

    if (formData.userPassword !== formData.userPasswordConfirm) {
      setMessages({ general: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
      return false;
    }
    if (!emailVerified) {
      setMessages({ general: '이메일 인증을 완료해주세요.' });
      return false;
    }

    if (duplicateStatus.userLoginId !== false) {
      setMessages((prev) => ({ ...prev, general: '아이디 중복 확인을 해주세요.' }));
      return false;
    }
    if (duplicateStatus.userNickname !== false) {
      setMessages((prev) => ({ ...prev, general: '닉네임 중복 확인을 해주세요.' }));
      return false;
    }
    if (duplicateStatus.userEmail !== false) {
      setMessages((prev) => ({ ...prev, general: '이메일 중복 확인을 해주세요.' }));
      return false;
    }

    try {
      const { userPasswordConfirm, ...dataToSend } = formData;
      const response = await axios.post('http://localhost:8080/api/signup/register', dataToSend);
      setMessages({ general: response.data.message || '회원가입 성공!' });
      navigate('/login');
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
      return false;
    }
  };

  return {
    formData,
    verificationCode,
    emailVerified,
    emailSent,
    messages,
    duplicateStatus,
    handleChange: handleAllChanges,
    handleEmailChange: handleAllChanges,
    handleVerificationCodeChange,
    handleSendVerificationCode: handleSendCode,
    handleVerifyEmailCode: verifyEmailCode,
    checkDuplicate: handleCheckDuplicate,
    handleSubmit,
    resetFormAndStates,
  };
}

export default useSignupForm;