// src/App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'; // useNavigate 추가
import SignupForm from './pages/signup/SignupForm';
import LoginForm from './pages/login/LoginForm';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';

// AppContent 컴포넌트를 분리하여 useNavigate 훅을 사용합니다.
function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null); // 사용자 닉네임과 같은 정보를 저장
  const navigate = useNavigate(); // 라우트 내에서 탐색을 위한 훅

  // 컴포넌트가 마운트되거나 업데이트될 때 로그인 상태를 확인하는 함수
  const checkLoginStatus = async () => {
    try {
      // 백엔드에 로그인 상태를 확인하는 엔드포인트 호출
      // 예: { isLoggedIn: true, userNickname: '사용자닉네임' } 또는 { isLoggedIn: false } 반환
      const response = await fetch('http://localhost:8080/api/user/status'); // 백엔드 URL 확인
      const data = await response.json();
      if (response.ok && data.isLoggedIn) {
        setIsLoggedIn(true);
        setCurrentUser({ userNickname: data.userNickname, userUsername: data.userUsername }); // 관련 사용자 데이터 저장
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
    checkLoginStatus(); // 컴포넌트 마운트 시 로그인 상태 확인
  }, []);

  // LoginForm에서 로그인 성공 시 호출될 콜백 함수
  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setCurrentUser(userData);
    navigate('/'); // 로그인 성공 후 홈 페이지로 리다이렉트
  };

  // Navbar에서 로그아웃 시 호출될 콜백 함수
  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/user/logout', { // 백엔드 URL 확인
        method: 'POST',
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setIsLoggedIn(false);
        setCurrentUser(null);
        navigate('/login'); // 로그아웃 후 로그인 페이지로 리다이렉트
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
      {/* Navbar에 로그인 상태와 로그아웃 핸들러 전달 */}
      <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
      <div className="container">
        <Routes>
          {/* 루트 경로: 로그인 상태에 따라 Home 또는 LoginForm 렌더링 */}
          <Route path="/" element={isLoggedIn ? <Home currentUser={currentUser} /> : <LoginForm onLoginSuccess={handleLoginSuccess} />} />
          {/* 회원가입 경로는 그대로 유지 */}
          <Route path="/signup" element={<SignupForm />} />
          {/* 로그인 경로는 LoginForm으로 연결, 로그인 성공 콜백 전달 */}
          <Route path="/login" element={<LoginForm onLoginSuccess={handleLoginSuccess} />} />
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent /> {/* AppContent 컴포넌트를 렌더링 */}
    </Router>
  );
}

export default App;

// 현재씨

// import React, { useState } from 'react';
// import AiModal from './components/AiModal'; // AiModal 컴포넌트 임포트
// import './App.css'; // 필요하다면 CSS 파일 임포트

// function App() {
//     const [isAiModalOpen, setIsAiModalOpen] = useState(false); // 모달 열림/닫힘 상태

//     const openAiModal = () => setIsAiModalOpen(true);
//     const closeAiModal = () => setIsAiModalOpen(false);

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <h1>7번국도 지역맛집</h1>
//                 {/* AI 기능 버튼 추가 */}
//                 <button 
//                     onClick={openAiModal} 
//                     style={{ 
//                         padding: '15px 30px', 
//                         fontSize: '1.2em', 
//                         backgroundColor: '#61dafb', 
//                         color: '#282c34', 
//                         border: 'none', 
//                         borderRadius: '10px', 
//                         cursor: 'pointer', 
//                         fontWeight: 'bold',
//                         marginTop: '20px'
//                     }}
//                 >
//                     AI 기능 사용하기
//                 </button>
//             </header>

//             {/* AI 모달 컴포넌트 */}
//             <AiModal 
//                 isOpen={isAiModalOpen} 
//                 onRequestClose={closeAiModal} 
//             />

//             {/* 나머지 애플리케이션 내용 */}
//             <main style={{ padding: '20px' }}>
//                 <p>여기에 맛집 목록이나 다른 콘텐츠가 표시됩니다.</p>
//             </main>
//         </div>
//     );
// }

// export default App;