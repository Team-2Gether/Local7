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

  const handleAllChanges = (e) => {
    const { name } = e.target;
    handleFormDataChange(e);

    setMessages((prev) => {
      const newMessages = { ...prev };
      delete newMessages.general;
      delete newMessages.emailStatus;
      delete newMessages.verificationCode;
      delete newMessages[`${name}`];
      if (name === 'userLoginId') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
      if (name === 'userNickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
      if (name === 'userEmail') {
        setDuplicateStatus((prev) => ({ ...prev, userEmail: null }));
        resetEmailVerification();
      }
      return newMessages;
    });
  };

  // 이미지 파일을 base64로 변환하여 formData에 저장하는 핸들러
  const handleImageChange = (event) => {
    const file = event.target.files ? event.target.files?.[0] : null;
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // reader.result는 "data:image/jpeg;base64,..." 형태의 문자열입니다.
        handleFormDataChange({ target: { name: 'userProfImgUrl', value: reader.result } });
      };
      reader.readAsDataURL(file); // 파일을 base64 URL로 읽기
    } else {
      handleFormDataChange({ target: { name: 'userProfImgUrl', value: '' } }); // 파일 선택 취소 시 초기화
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({}); // Submit 시 모든 메시지 초기화 (선택 사항)

    // 유효성 검사 로직 (기존 로직 유지)
    if (!formData.userLoginId || !formData.userPassword || !formData.userPasswordConfirm || !formData.userEmail || !formData.userNickname || !formData.userName) {
      setMessages({ general: '모든 필수 필드를 입력해주세요.' });
      return false;
    }
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
      const response = await registerUser(dataToSend);
      setMessages({ general: response.message || '회원가입 성공!' });
      navigate('/');
      resetFormAndStates(); // 회원가입 성공 후 폼 초기화
      return true;
    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
      return false;
    }
  };

  // 모든 상태를 초기화하는 함수 추가
  const resetFormAndStates = () => {
    resetFormData();
    resetEmailVerification();
    resetDuplicateStatus();
    setMessages({});
  };

  return {
    formData,
    verificationCode,
    emailVerified,
    emailSent,
    messages,
    duplicateStatus,
    handleChange: handleAllChanges,
    handleImageChange, // 추가
    handleEmailChange: handleAllChanges,
    handleVerificationCodeChange,
    handleSendVerificationCode: sendVerificationCode,
    handleVerifyEmailCode: verifyEmailCode,
    checkDuplicate,
    handleSubmit,
    resetFormAndStates
  };
}

export default useSignupForm;