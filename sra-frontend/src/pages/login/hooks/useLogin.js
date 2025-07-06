import { useState } from 'react';
import { loginUser } from '../../../api/LoginApi'; 

function useLogin(onLoginSuccess) { 
  const [credential, setCredential] = useState(''); 
  const [password, setPassword] = useState(''); 

  const handleSubmit = async (e) => { 
    e.preventDefault();
    try {
      const data = await loginUser(credential, password); 

      alert(data.message || "로그인 성공!"); 
      onLoginSuccess({
        userId: data.userId,
        userLoginId: data.userLoginId,
        userUsername: data.userUsername,
        userNickname: data.userNickname,
        userBio: data.userBio,
        userEmail: data.userEmail,
        ruleId: data.ruleId,
        userRule: data.userRule
      });
    } catch (error) { 
      console.error("로그인 중 오류 발생:", error);
      if (error.response && error.response.data && error.response.data.message) {
        alert("로그인 실패: " + error.response.data.message);
      } else {
        alert("로그인 중 오류가 발생했습니다.");
      }
    }
  };

  return {
    credential,
    setCredential,
    password,
    setPassword,
    handleSubmit,
  };
}

export default useLogin;