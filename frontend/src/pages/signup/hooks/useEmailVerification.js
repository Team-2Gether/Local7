import {useState} from 'react';
import {
  sendEmailVerificationCode as apiSendEmailVerificationCode, //이름변경
  verifyEmailCode as apiVerifyEmailCode //이름변경
} from '../../../api/SignupApi';

const useEmailVerification = (userEmail, setMessages) => {
  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    setMessages((prev) => ({...prev, verificationCode: ''}));
  };

  const sendVerificationCode = async () => {
    setMessages((prev) => {
      const newMsgs = {...prev};
      delete newMsgs.userEmail;
      delete newMsgs.general;
      delete newMsgs.emailStatus;
      delete newMsgs.verificationCode;
      return newMsgs;
    });

    if (!userEmail) {
      setMessages((prev) => ({...prev, userEmail: '이메일을 입력해주세요.'}));
      return false;
    }

    try {
      //변경된API함수이름사용
      const response = await apiSendEmailVerificationCode(userEmail);
      if (response.status === 'success') {
        setMessages((prev) => ({...prev, general: response.message, emailStatus: 'pending'}));
        setEmailSent(true);
        return true;
      } else {
        //API응답에'code'필드가있을경우처리
        if (response.code === 'duplicate_email') {
          setMessages((prev) => ({...prev, userEmail: response.message})); //field-specific메시지로설정
          setEmailSent(false); //중복이므로인증코드전송안함
          return false;
        } else {
          setMessages((prev) => ({...prev, general: response.message}));
          return false;
        }
      }
    } catch (error) {
      const apiResponse = error.response?.data; //HTTP에러의실제응답본문
      const errorMessage = apiResponse?.message || '인증 코드 전송 중 오류가 발생했습니다.';
      const errorCode = apiResponse?.code;

      if (errorCode === 'duplicate_email') {
        setMessages((prev) => ({...prev, userEmail: errorMessage})); //field-specific메시지로설정
        setEmailSent(false); //중복이므로emailSent는false
      } else {
        setMessages((prev) => ({...prev, general: errorMessage, emailStatus: 'failed'})); //기타오류는general메시지로설정
      }
      setEmailVerified(false);
      return false;
    }
  };

  const verifyEmailCode = async () => {
    setMessages((prev) => {
      const newMsgs = {...prev};
      delete newMsgs.verificationCode;
      delete newMsgs.general;
      return newMsgs;
    });

    if (!verificationCode) {
      setMessages((prev) => ({...prev, verificationCode: '인증 코드를 입력해주세요.'}));
      return false;
    }

    try {
      //변경된API함수이름사용
      const response = await apiVerifyEmailCode(userEmail, verificationCode);
      if (response.status === 'success') {
        setMessages((prev) => ({...prev, general: response.message, emailStatus: 'verified'}));
        setEmailVerified(true);
        return true;
      } else {
        setMessages((prev) => ({...prev, general: response.message, emailStatus: 'failed'}));
        setEmailVerified(false);
        return false;
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.';
      setMessages((prev) => ({...prev, general: errorMessage, emailStatus: 'failed'}));
      setEmailVerified(false);
      return false;
    }
  };

  const resetEmailVerification = () => {
    setVerificationCode('');
    setEmailVerified(false);
    setEmailSent(false);
    setMessages((prev) => {
      const newMessages = {...prev};
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