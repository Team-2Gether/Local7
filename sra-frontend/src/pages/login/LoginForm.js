// src/pages/login/LoginForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './LoginForm.css'; // Import the CSS file

function LoginForm({ onLoginSuccess }) {
  const [credential, setCredential] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

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
        onLoginSuccess({ userNickname: data.user.userNickname, userUsername: data.user.userUsername });
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

  return (
    <div className="login-form-container">
      {/* Logo */}
      <img src="/path/to/your/logo.png" alt="LOCALR7 Logo" className="logo" />
      {/* You'll need to replace "/path/to/your/logo.png" with the actual path to your logo image */}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            id="credential"
            value={credential}
            onChange={(e) => setCredential(e.target.value)}
            placeholder="Email" /* Changed to placeholder */
            required
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password" /* Changed to placeholder */
            required
          />
        </div>
        <button type="submit">LOGIN</button>
      </form>

      <div className="links-container">
        <a href="#">회원 가입</a>
        <a href="#">비밀번호 변경</a>
        <a href="#">이용 약관</a>
      </div>

      <button className="intro-button" onClick={() => navigate('/intro')}>
        <span>사이트 소개</span> <span className="go-text">GO</span>
      </button>
    </div>
  );
}

export default LoginForm;