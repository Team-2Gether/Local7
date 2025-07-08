import { useState } from 'react';
// import axios from 'axios'; // 직접 Axios 사용 대신 API 함수 임포트
import useEmailVerification from './useEmailVerification';
import useDuplicateCheck from './useDuplicateCheck';
import { registerUser } from '../../../api/SignupApi'; // SignupApi에서 registerUser 함수 임포트
import useFormData from '../../../common/useFormData';

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
    verifyEmailCode, // useEmailVerification에서 반환되는 이름과 일치하도록 수정
    resetEmailVerification,
  } = useEmailVerification(formData.userEmail, setMessages);

  // setDuplicateStatus를 useDuplicateCheck 훅의 반환 값에 추가했으므로 구조 분해 할당
  const { duplicateStatus, checkDuplicate, resetDuplicateStatus, setDuplicateStatus } = useDuplicateCheck(setMessages); 

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
        delete newMessages.general; // 일반 메시지 초기화
        if (name === 'userLoginId') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
        if (name === 'userNickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
        if (name === 'userEmail') {
          setDuplicateStatus((prev) => ({ ...prev, userEmail: null }));
          resetEmailVerification(); // 이메일 변경 시 인증 상태 초기화
        }
      }
      return newMessages;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({}); // Submit 시 모든 메시지 초기화 (선택 사항)

    // 유효성 검사 로직 (기존 로직 유지)
    if (!formData.userLoginId || !formData.userPassword || !formData.userPasswordConfirm || !formData.userEmail || !formData.userNickname || !formData.userUsername) {
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
      // API 함수 호출로 변경
      const response = await registerUser(dataToSend);
      setMessages({ general: response.message || '회원가입 성공!' });
      navigate('/login');
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
    handleEmailChange: handleAllChanges, // handleChange가 userEmail도 처리하므로 별도 함수 필요 없을 수 있음
    handleVerificationCodeChange,
    handleSendVerificationCode: sendVerificationCode, // 이름 일관성을 위해 수정
    handleVerifyEmailCode: verifyEmailCode, // 이름 일관성을 위해 수정
    checkDuplicate,
    handleSubmit, // handleSubmit으로 반환
    resetFormAndStates
  };
}

export default useSignupForm;