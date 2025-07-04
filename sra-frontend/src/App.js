// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './common/Home';
import SignupForm from './pages/signup/SignupForm';
import LoginForm from './pages/login/LoginForm';
import Navbar from './common/Navbar';

function App() {
  return (
    <Router>
      <Navbar />
      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
        </Routes>
      </div>
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