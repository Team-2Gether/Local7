import { useState } from 'react';
import axios from 'axios';

function useLogin(onLoginSuccess) {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');

  axios.defaults.withCredentials = true;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        credential,
        password,
      });
      const data = response.data;

      if (response.status === 200) {
        alert(data.message);
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
      } else {
        alert("로그인 실패: " + data.message);
      }
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