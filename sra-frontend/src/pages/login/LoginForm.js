// src/pages/login/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
// import { useNavigate } from 'react-router-dom'; // App.js에서 리다이렉션 처리하므로 여기서는 필요 없음
import './LoginForm.css'; // For styling

// LoginForm은 onLoginSuccess prop을 받습니다.
function LoginForm({ onLoginSuccess }) { // Prop으로 onLoginSuccess를 받도록 변경
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  // const navigate = useNavigate(); // 이제 필요 없습니다.

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!credential || !password) {
      setMessage('아이디/이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', { // 백엔드 URL 확인
        credential,
        password,
      });

      if (response.data.status === 'success') {
        setMessage(response.data.message);
        console.log('Login successful!', response.data.user);
        alert(response.data.message + '\n환영합니다, ' + (response.data.user.userNickname || response.data.user.userUsername) + '님!');

        // 로그인 성공 시 App.js로부터 받은 콜백 함수 호출
        if (onLoginSuccess) {
          onLoginSuccess(response.data.user); // 사용자 데이터를 전달
        }
        // navigate('/'); // 직접적인 리다이렉션은 App.js에서 처리
      } else {
        setMessage(response.data.message || '로그인 실패: 알 수 없는 오류.');
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '로그인 중 오류가 발생했습니다.';
      setMessage(errorMessage);
      console.error('Login error:', error.response || error);
    }
  };

  return (
    <div className="login-container">
      <h2>로그인</h2>
      {message && <p className={`message ${message.includes('성공') ? 'success' : 'error'}`}>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="credential">아이디 또는 이메일:</label>
          <input
            type="text"
            id="credential"
            name="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">비밀번호:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn-login">로그인</button>
      </form>
    </div>
  );
}

export default LoginForm;