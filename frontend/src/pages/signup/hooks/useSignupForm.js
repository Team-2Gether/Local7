import { useState } from 'react';
import useEmailVerification from './useEmailVerification';
import useDuplicateCheck from './useDuplicateCheck';
import { registerUser } from '../../../api/SignupApi';
import useFormData from '../../../common/useFormData';

function useSignupForm(navigate) {
  const initialFormData = {
    userLoginId: '',
    userPassword: '',
    userPasswordConfirm: '',
    userEmail: '',
    userNickname: '',
    userName: '',
    userProfImgUrl: '', // base64 문자열을 저장할 필드
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

  const { duplicateStatus, checkDuplicate, resetDuplicateStatus, setDuplicateStatus } = useDuplicateCheck(setMessages);

  const [agreements, setAgreements] = useState({
    termsAndPrivacy: false,
    marketingConsent: false,
  });

  const handleAgreementChange = (e) => {
    const { name, checked } = e.target;
    setAgreements((prev) => ({
      ...prev,
      [name]: checked,
    }));

    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages.agreements;
      return newMessages;
    });
  };

  // 비밀번호 유효성 검사 함수
  const validatePassword = (password) => {
    if (password.length > 0 && password.length < 8) {
      return '비밀번호는 최소 8자 이상이어야 합니다.';
    }
    return '';
  };

  const handleAllChanges = (e) => {
    const { name, value } = e.target;
    handleFormDataChange(e);

    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages.general;
      delete newMessages.emailStatus;
      delete newMessages.verificationCode;
      delete newMessages[`${name}`];

      // 비밀번호 유효성 검사
      if (name === 'userPassword') {
        const passwordError = validatePassword(value);
        if (passwordError) {
          newMessages.userPassword = passwordError;
        } else {
          delete newMessages.userPassword;
        }
        // 비밀번호 확인 필드도 함께 검사하여 업데이트 (비밀번호 변경 시 확인 필드의 일치 여부 다시 검사)
        if (formData.userPasswordConfirm && value !== formData.userPasswordConfirm) {
          newMessages.userPasswordConfirm = '비밀번호가 일치하지 않습니다.';
        } else if (formData.userPasswordConfirm && value === formData.userPasswordConfirm) {
          delete newMessages.userPasswordConfirm;
        }
      } else if (name === 'userPasswordConfirm') {
        if (formData.userPassword !== value) {
          newMessages.userPasswordConfirm = '비밀번호가 일치하지 않습니다.';
        } else {
          delete newMessages.userPasswordConfirm;
        }
      }

      if (name === 'userLoginId') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
      if (name === 'userNickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
      if (name === 'userEmail') {
        setDuplicateStatus((prev) => ({ ...prev, userEmail: null }));
        resetEmailVerification();
      }
      return newMessages;
    });
  };

  const handleImageChange = (event) => {
    const file = event.target.files ? event.target.files?.[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFormDataChange({ target: { name: 'userProfImgUrl', value: reader.result } });
      };
      reader.readAsDataURL(file);
    } else {
      handleFormDataChange({ target: { name: 'userProfImgUrl', value: '' } });
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({});

    if (!formData.userLoginId || !formData.userPassword || !formData.userPasswordConfirm || !formData.userEmail || !formData.userNickname || !formData.userName) {
      setMessages({ general: '모든 필수 필드를 입력해주세요.' });
      return false;
    }

    const passwordLengthError = validatePassword(formData.userPassword);
    if (passwordLengthError) {
      setMessages((prev) => ({ ...prev, userPassword: passwordLengthError, general: '비밀번호를 확인해주세요.' }));
      return false;
    }

    if (formData.userPassword !== formData.userPasswordConfirm) {
      setMessages((prev) => ({ ...prev, userPasswordConfirm: '비밀번호와 비밀번호 확인이 일치하지 않습니다.', general: '비밀번호 확인이 일치하지 않습니다.' }));
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

    if (!agreements.termsAndPrivacy) {
      setMessages({ agreements: '서비스 이용약관 및 개인정보 처리방침에 동의해 주세요.' });
      return false;
    }

    try {
      const { userPasswordConfirm, ...dataToSend } = formData;
      const response = await registerUser(dataToSend);
      setMessages({ general: response.message || '회원가입 성공!' });
      navigate('/');
      resetFormAndStates();
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
      return false;
    }
  };

  const resetFormAndStates = () => {
    resetFormData();
    resetEmailVerification();
    resetDuplicateStatus();
    setMessages({});
    setAgreements({
      termsAndPrivacy: false,
      marketingConsent: false,
    });
  };

  return {
    formData,
    verificationCode,
    emailVerified,
    emailSent,
    messages,
    duplicateStatus,
    agreements,
    handleChange: handleAllChanges,
    handleImageChange,
    handleEmailChange: handleAllChanges,
    handleVerificationCodeChange,
    handleSendVerificationCode: sendVerificationCode,
    handleVerifyEmailCode: verifyEmailCode,
    checkDuplicate,
    handleAgreementChange,
    handleSubmit,
    resetFormAndStates
  };
}

export default useSignupForm;