// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Main from './pages/home/main';
import LoginForm from './pages/login/LoginForm';
import NotFoundPage from './components/404page/NotFoundPage';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import MyPage from './pages/user/MyPage';
import UserPage from './pages/user/UserPage';
import Sidebar from './components/Sidebar'; // Sidebar import 추가
import AiModal from './pages/ai/components/AiModal'; // AiModal import 추가

import sea from './assets/images/sea.png';
import ko from './assets/images/ko.png';
import first from './assets/images/first.png';
import './App.css';

Modal.setAppElement('#root');

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false); // AiModal 상태 추가
    const [activeContent, setActiveContent] = useState('home'); // activeContent 상태 추가

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/user/status');
            const data = response.data;
            if (response.status === 200 && data.isLoggedIn) {
                setIsLoggedIn(true);
                setCurrentUser({
                    userId: data.userId,
                    userLoginId: data.userLoginId,
                    userName: data.userName,
                    userNickname: data.userNickname,
                    userBio: data.userBio,
                    userEmail: data.userEmail,
                    ruleId: data.ruleId,
                    userRule: data.userRule,
                    userProfileImageUrl: data.userProfileImageUrl,
                    createDate: data.createDate,
                    createdId: data.createdId,
                    updatedDate: data.updatedDate,
                    updatedId: data.updatedId
                });
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
        setIsLoginModalOpen(false);
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

    const openTermsModal = () => setIsTermsModalOpen(true);
    const closeTermsModal = () => setIsTermsModalOpen(false);

    // Sidebar 메뉴 클릭 핸들러
    const handleSidebarClick = (item) => {
        if (item === 'ai') {
            setIsAiModalOpen(true);
        } else {
            setActiveContent(item);
            setIsAiModalOpen(false);

            if (item === 'home') navigate('/');
            else if (item === 'posts') navigate('/posts');
            else if (item === 'add') navigate('/posts/new');
            else if (item === 'mypage') navigate('/mypage');
            else if (item === 'pick') navigate('/pick');
        }
    };

    return (
        <div className="app-layout">
            {isLoggedIn && (
                <>
                    <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
                    <Sidebar onMenuItemClick={handleSidebarClick} /> {/* Sidebar 추가 */}
                </>
            )}

            <div className="main-content-area"> {/* Main 콘텐츠 영역 추가 */}
                <Routes>
                    <Route path="/*" element={isLoggedIn ? (
                        <Main currentUser={currentUser} activeContent={activeContent} /> // activeContent 전달
                    ) : (
                        <div className="initial-login-screen">
                            <div className="login-image-wrapper">
                                <img
                                    src={sea}
                                    alt="sea"
                                    className="login-background-image"
                                />
                                <img
                                    src={ko}
                                    alt="ko"
                                    className="overlay-image ko-image"
                                />
                                <img
                                    src={first}
                                    alt="first"
                                    className="overlay-image first-image"
                                />
                                <button
                                    className="login-trigger-button"
                                    onClick={() => setIsLoginModalOpen(true)}
                                >
                                    로그인
                                </button>
                            </div>
                        </div>
                    )} />

                    {/* 마이페이지 경로 추가 */}
                    <Route path="/mypage" element={isLoggedIn ? (
                        <MyPage currentUser={currentUser} isLoggedIn={isLoggedIn} />
                    ) : (
                        <div className="initial-login-screen">
                            로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                        </div>
                    )} />

                    {/* UserPage 경로 추가 */}
                    <Route path="/userpage" element={isLoggedIn ? (
                        <UserPage currentUser={currentUser} onLogout={handleLogout} />
                    ) : (
                        <div className="initial-login-screen">
                            로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                        </div>
                    )} />

                    {/* 회원가입 페이지: 로그인 상태와 무관하게 항상 접근 가능 */}
                    <Route path="/signup" element={<SignupForm />} />

                    {/* 404 페이지: 모든 일치하지 않는 경로 처리 (Main 내부에서 처리되지 않는 경우) */}
                    <Route path="*" element={<NotFoundPage />} />
                </Routes>
            </div>

            {/* 로그인 모달: 항상 렌더링되지만, isLoginModalOpen 상태에 따라 보임/숨김 */}
            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setIsLoginModalOpen(false)}
                className="login-modal-content"
                overlayClassName="login-modal-overlay"
                contentLabel="로그인 모달"
            >
                <LoginForm onLoginSuccess={handleLoginSuccess} onCloseModal={() => setIsLoginModalOpen(false)} onOpenTermsModal={openTermsModal} />
            </Modal>

            {/* 이용약관 모달 */}
            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={closeTermsModal}
                showAgreeButton={false}
            />

            {/* AiModal 추가 */}
            <AiModal isOpen={isAiModalOpen} onRequestClose={() => setIsAiModalOpen(false)} />
        </div>
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