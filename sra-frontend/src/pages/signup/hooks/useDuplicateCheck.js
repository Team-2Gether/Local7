// src/pages/signup/hooks/useDuplicateCheck.js
import { useState } from 'react';
// import axios from 'axios'; // 직접 Axios 사용 대신 API 함수 임포트
import { checkDuplicate as apiCheckDuplicate } from '../../../api/SignupApi'; // SignupApi에서 checkDuplicate 함수 임포트

const useDuplicateCheck = (setMessages) => {
  const [duplicateStatus, setDuplicateStatus] = useState({
    userLoginId: null,
    userNickname: null,
    userEmail: null,
  });

  const checkDuplicate = async (field, value, updateStatus = true) => {
    setMessages((prev) => {
      const newMsgs = { ...prev };
      delete newMsgs[field];
      if (field === 'login-id' || field === 'nickname' || field === 'email') {
        delete newMsgs.general;
      }
      return newMsgs;
    });

    if (!value) {
      if (updateStatus) {
        if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
        if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
        if (field === 'email') setDuplicateStatus((prev) => ({ ...prev, userEmail: null }));
      }
      return false;
    }

    try {
      // API 함수 호출로 변경
      const response = await apiCheckDuplicate(field, value); // 'apiCheckDuplicate' 사용
      if (response.isDuplicate) {
        setMessages((prev) => ({ ...prev, [field]: `이미 사용 중인 ${field === 'login-id' ? '아이디' : (field === 'email' ? '이메일' : '닉네임')}입니다.` }));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: true }));
          if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: true }));
          if (field === 'email') setDuplicateStatus((prev) => ({ ...prev, userEmail: true }));
        }
        return true;
      } else {
        setMessages((prev) => ({ ...prev, [field]: '' }));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: false }));
          if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: false }));
          if (field === 'email') setDuplicateStatus((prev) => ({ ...prev, userEmail: false }));
        }
        return false;
      }
    } catch (error) {
      console.error(`Error checking duplicate ${field}:`, error);
      setMessages((prev) => ({ ...prev, [field]: `중복 확인 중 오류가 발생했습니다.` }));
      if (updateStatus) {
        if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
        if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
        if (field === 'email') setDuplicateStatus((prev) => ({ ...prev, userEmail: null }));
      }
      return false;
    }
  };

  const resetDuplicateStatus = () => {
    setDuplicateStatus({ userLoginId: null, userNickname: null, userEmail: null });
  };

  return { duplicateStatus, checkDuplicate, resetDuplicateStatus, setDuplicateStatus };
};

export default useDuplicateCheck;