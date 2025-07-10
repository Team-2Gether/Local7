import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Main from './pages/home/Home';
import LoginForm from './pages/login/LoginForm';
import NotFoundPage from './components/404page/NotFoundPage';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import MyPage from './pages/user/MyPage';
import UserPage from './pages/user/UserPage';
import Sidebar from './components/Sidebar'; 
import AiModal from './pages/ai/components/AiModal'; 

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
    const [isAiModalOpen, setIsAiModalOpen] = useState(false); 
    const [activeContent, setActiveContent] = useState('home'); 

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
        navigate('/'); 
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/logout');
            const data = response.data;
            if (response.status === 200) {
                alert(data.message);
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigate('/'); 
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
                <div className="navbar-container"> 
                    <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
                </div>
            )}

            <div className="main-content-area"> 
                {isLoggedIn && (
                    <div className="sidebar-container"> 
                        <Sidebar onMenuItemClick={handleSidebarClick} />
                    </div>
                )}
                
                <div className="content-with-sidebar"> 
                    <Routes>
                        <Route path="/*" element={isLoggedIn ? (
                            <Main currentUser={currentUser} activeContent={activeContent} />
                        ) : (
                            <div className="initial-login-screen">
                                <div className="login-image-wrapper">
                                    <img src={sea} alt="sea" className="login-background-image" />
                                    <img src={ko} alt="ko" className="overlay-image ko-image" />
                                    <img src={first} alt="first" className="overlay-image first-image" />
                                    <button
                                        className="login-trigger-button"
                                        onClick={() => setIsLoginModalOpen(true)}
                                    >
                                        로그인
                                    </button>
                                </div>
                            </div>
                        )} />

                        <Route path="/mypage" element={isLoggedIn ? (
                            <MyPage currentUser={currentUser} isLoggedIn={isLoggedIn} />
                        ) : (
                            <div className="initial-login-screen">
                                로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                            </div>
                        )} />

                        <Route path="/userpage" element={isLoggedIn ? (
                            <UserPage currentUser={currentUser} onLogout={handleLogout} />
                        ) : (
                            <div className="initial-login-screen">
                                로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                            </div>
                        )} />

                        <Route path="/signup" element={<SignupForm />} />

                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>

            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setIsLoginModalOpen(false)}
                className="login-modal-content"
                overlayClassName="login-modal-overlay"
                contentLabel="로그인 모달"
            >
                <LoginForm onLoginSuccess={handleLoginSuccess} onCloseModal={() => setIsLoginModalOpen(false)} onOpenTermsModal={openTermsModal} />
            </Modal>

            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={closeTermsModal}
                showAgreeButton={false}
            />

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