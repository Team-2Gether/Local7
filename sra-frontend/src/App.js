// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import LoginForm from './pages/login/LoginForm';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  // Configure axios to send cookies with all requests
  axios.defaults.withCredentials = true;

  const checkLoginStatus = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/user/status'); // Use axios.get
      const data = response.data; // Axios wraps response data in .data
      if (response.status === 200 && data.isLoggedIn) {
        setIsLoggedIn(true);
        setCurrentUser({ userNickname: data.userNickname, userUsername: data.userUsername });
      } else {
        setIsLoggedIn(false);
        setCurrentUser(null);
      }
    } catch (error) {
      console.error("로그인 상태를 가져오지 못했습니다:", error);
      setIsLoggedIn(false);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      const response = await axios.post('http://localhost:8080/api/user/logout'); // Use axios.post
      const data = response.data; // Axios wraps response data in .data
      if (response.status === 200) {
        alert(data.message);
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/login');
      } else {
        alert("로그아웃 실패: " + data.message);
      }
    } catch (error) {
      console.error("로그아웃 실패:", error);
      alert("로그아웃 중 오류가 발생했습니다.");
    }
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          <Route path="/" element={isLoggedIn ? <Home currentUser={currentUser} /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;