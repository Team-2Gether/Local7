// src/components/LoginForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // For redirection
import './LoginForm.css'; // For styling

function LoginForm() {
  const [credential, setCredential] = useState(''); // Can be userLoginId or userEmail
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages

    if (!credential || !password) {
      setMessage('아이디/이메일과 비밀번호를 모두 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/user/login', {
        credential,
        password,
      });

      if (response.data.status === 'success') {
        setMessage(response.data.message);
        // Here you would typically store user info (e.g., in context, Redux, localStorage)
        // For simplicity, let's just log and redirect.
        console.log('Login successful!', response.data.user);
        alert(response.data.message + '\n환영합니다, ' + (response.data.user.userNickname || response.data.user.userUsername) + '님!');
        navigate('/'); // Redirect to home page or dashboard
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