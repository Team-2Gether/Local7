import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal'; // react-modal 임포트
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import LoginForm from './pages/login/LoginForm';
import NotFoundPage from './components/404page/NotFoundPage';
import './App.css'; // App.css 임포트 유지

// react-modal이 앱의 루트 요소를 식별하도록 설정합니다.
Modal.setAppElement('#root');

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/status');
            const data = response.data;
            if (response.status === 200 && data.isLoggedIn) {
                setIsLoggedIn(true);
                setCurrentUser({ userNickname: data.userNickname, userUsername: data.userUsername, userEmail: data.userEmail });
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
        setIsLoginModalOpen(false); // 로그인 성공 시 모달 닫기
        navigate('/'); // 홈 페이지로 이동
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/logout');
            const data = response.data;
            if (response.status === 200) {
                alert(data.message);
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigate('/'); // 로그아웃 후 초기 로그인 화면으로 이동
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
            {/* Navbar는 로그인된 경우에만 표시 */}
            {isLoggedIn && (
                <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
            )}

            {/* Routes는 항상 활성화되도록 조건부 렌더링 밖으로 이동 */}
            <Routes>
                {/* 루트 경로: 로그인 상태에 따라 Home 컴포넌트 또는 초기 로그인 화면 표시 */}
                <Route path="/" element={isLoggedIn ? (
                    <div className="main-app-content"> {/* 로그인 후의 메인 콘텐츠 영역 */}
                        <Home currentUser={currentUser} />
                    </div>
                ) : (
                    <div className="initial-login-screen"> {/* 로그인 안 된 초기 화면 */}
                        {/* 로그인 버튼은 이 화면 내에 위치 */}
                        <button
                            className="login-trigger-button"
                            onClick={() => setIsLoginModalOpen(true)}
                        >
                            로그인
                        </button>
                    </div>
                )} />

                {/* 회원가입 페이지: 로그인 상태와 무관하게 항상 접근 가능 */}
                <Route path="/signup" element={<SignupForm />} />

                {/* 404 페이지: 모든 일치하지 않는 경로 처리 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>

            {/* 로그인 모달: 항상 렌더링되지만, isLoginModalOpen 상태에 따라 보임/숨김 */}
            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setIsLoginModalOpen(false)}
                className="login-modal-content"
                overlayClassName="login-modal-overlay"
                contentLabel="로그인 모달"
            >
                <LoginForm onLoginSuccess={handleLoginSuccess} onCloseModal={() => setIsLoginModalOpen(false)}/>
            </Modal>
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