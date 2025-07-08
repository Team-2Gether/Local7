import {useState} from 'react';
//import axios from 'axios'; //직접Axios사용대신API함수임포트
import {checkDuplicate as apiCheckDuplicate} from '../../../api/SignupApi'; //SignupApi에서checkDuplicate함수임포트

const useDuplicateCheck = (setMessages) => {
  const [duplicateStatus, setDuplicateStatus] = useState({
    userLoginId: null,
    userNickname: null,
    userEmail: null,
  });

  const checkDuplicate = async (field, value, updateStatus = true) => {
    setMessages((prev) => {
      const newMsgs = {...prev};
      //메시지키를확인하여삭제
      const messageKeyToDelete = field === 'login-id' ? 'userLoginId' : (field === 'email' ? 'userEmail' : field);
      delete newMsgs[messageKeyToDelete];
      if (field === 'login-id' || field === 'nickname' || field === 'email') {
        delete newMsgs.general;
      }
      return newMsgs;
    });

    if (!value) {
      if (updateStatus) {
        if (field === 'login-id') setDuplicateStatus((prev) => ({...prev, userLoginId: null}));
        if (field === 'nickname') setDuplicateStatus((prev) => ({...prev, userNickname: null}));
        if (field === 'email') setDuplicateStatus((prev) => ({...prev, userEmail: null}));
      }
      return false;
    }

    try {
      //API함수호출로변경
      const response = await apiCheckDuplicate(field, value); // 'apiCheckDuplicate'사용
      if (response.isDuplicate) {
        //메시지키를조정하여저장
        const messageKey = field === 'login-id' ? 'userLoginId' : (field === 'email' ? 'userEmail' : field);
        setMessages((prev) => ({...prev, [messageKey]: `이미 사용 중인 ${field === 'login-id' ? '아이디' : (field === 'email' ? '이메일' : '닉네임')}입니다.`}));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({...prev, userLoginId: true}));
          if (field === 'nickname') setDuplicateStatus((prev) => ({...prev, userNickname: true}));
          if (field === 'email') setDuplicateStatus((prev) => ({...prev, userEmail: true}));
        }
        return true;
      } else {
        //메시지키를조정하여빈문자열로설정
        const messageKey = field === 'login-id' ? 'userLoginId' : (field === 'email' ? 'userEmail' : field);
        setMessages((prev) => ({...prev, [messageKey]: ''}));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({...prev, userLoginId: false}));
          if (field === 'nickname') setDuplicateStatus((prev) => ({...prev, userNickname: false}));
          if (field === 'email') setDuplicateStatus((prev) => ({...prev, userEmail: false}));
        }
        return false;
      }
    } catch (error) {
      console.error(`Error checking duplicate ${field}:`, error);
      //메시지키를조정하여오류메시지설정
      const messageKey = field === 'login-id' ? 'userLoginId' : (field === 'email' ? 'userEmail' : field);
      setMessages((prev) => ({...prev, [messageKey]: `중복 확인 중 오류가 발생했습니다.`}));
      if (updateStatus) {
        if (field === 'login-id') setDuplicateStatus((prev) => ({...prev, userLoginId: null}));
        if (field === 'nickname') setDuplicateStatus((prev) => ({...prev, userNickname: null}));
        if (field === 'email') setDuplicateStatus((prev) => ({...prev, userEmail: null}));
      }
      return false;
    }
  };

  const resetDuplicateStatus = () => {
    setDuplicateStatus({userLoginId: null, userNickname: null, userEmail: null});
  };

  return {duplicateStatus, checkDuplicate, resetDuplicateStatus, setDuplicateStatus};
};

export default useDuplicateCheck;