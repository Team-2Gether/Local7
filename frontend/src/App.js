import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';

import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Main from './pages/home/Main';
import LoginForm from './pages/login/LoginForm';
import NotFoundPage from './components/404page/NotFoundPage';
import TermsOfServiceModal from './components/TermsOfServiceModal';
import MyPage from './pages/user/MyPage';
import UserPage from './pages/user/UserPage';
import Sidebar from './components/Sidebar';
import AiModal from './pages/ai/components/AiModal';

import PostForm from './pages/post/PostForm';

import sea from './assets/images/sea.png';
import ko from './assets/images/ko.png';
import first from './assets/images/first.png';
import './App.css';
import MyPosts from './pages/user/MyPosts';
import PostList from './pages/post/components/PostList';
import PostDetail from './pages/post/components/PostDetail';
import Notice from './pages/notice/Notice';


Modal.setAppElement('#root');

function AppContent() {
    // sessionStorage 대신 초기 상태는 기본값으로 설정하고, 서버에서 가져오도록 변경
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [activeContent, setActiveContent] = useState('home');

    const navigate = useNavigate();

    axios.defaults.withCredentials = true; // 서버 세션(쿠키)을 사용하기 위해 필요

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/auth/status');
            const data = response.data;
            if (response.status === 200 && data.isLoggedIn) {
                setIsLoggedIn(true);
                const userData = {
                    userId: data.userId,
                    userLoginId: data.userLoginId,
                    userName: data.userName,
                    userNickname: data.userNickname,
                    userBio: data.userBio,
                    userEmail: data.userEmail,
                    ruleId: data.ruleId,
                    userProfileImageUrl: data.userProfileImageUrl,
                    createDate: data.createDate,
                    createdId: data.createdId,
                    updatedDate: data.updatedDate,
                    updatedId: data.updatedId
                };
                setCurrentUser(userData);
                // sessionStorage 사용 로직 제거
            } else {
                setIsLoggedIn(false);
                setCurrentUser(null);
                // sessionStorage 사용 로직 제거
            }
        } catch (error) {
            console.error("로그인 상태를 가져오지 못했습니다:", error);
            setIsLoggedIn(false);
            setCurrentUser(null);
            // sessionStorage 사용 로직 제거
        }
    };

    useEffect(() => {
        checkLoginStatus();
    }, []); // 컴포넌트 마운트 시 한 번만 실행

    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setCurrentUser(userData);
        setIsLoginModalOpen(false);
        // sessionStorage 사용 로직 제거
        console.log("로그인 성공", userData);
        navigate('/');
    };

    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/auth/logout');
            const data = response.data;
            if (response.status === 200) {
                alert(data.message);
                setIsLoggedIn(false);
                setCurrentUser(null);
                // sessionStorage 사용 로직 제거
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
            else if (item === 'restaurants') navigate('/restaurants');
            else if (item === 'posts') navigate('/posts');
            else if (item === 'add') navigate('/posts/new');
            else if (item === 'mypage') navigate('/mypage');
            else if (item === 'pick') navigate('/pick');
            else if (item === 'notice') navigate('/notice');
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
                        {/* 로그인 상태에 따른 메인 페이지 라우트 */}
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

                        {/* currentUser prop 추가 */}
                        <Route path="/posts" element={<PostList currentUser={currentUser} />} />

                        {/* currentUser prop 추가 */}
                        <Route path="/posts/new" element={<PostForm currentUser={currentUser} />} />

                        {/* currentUser prop 추가 */}
                        <Route path="/posts/edit/:id" element={<PostForm currentUser={currentUser} />} />

                        {/* 게시글 상세 페이지 라우트 */}
                        <Route path="/posts/:id" element={<PostDetail currentUser={currentUser} />} />


                        {/* MyPage와 그 자식 라우트들을 설정 */}
                        <Route path="/mypage" element={isLoggedIn ? (
                            <MyPage currentUser={currentUser} isLoggedIn={isLoggedIn} />
                        ) : (
                            <div className="initial-login-screen">
                                로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                            </div>
                        )}>
                            {/* MyPage 기본 경로로 접속 시 UserInfo 컴포넌트 렌더링 */}
                            <Route index element={<UserInfo userData={currentUser} />} />
                            {/* UserPage 링크에 연결될 라우트 (회원 정보 수정) */}
                            <Route path="edit" element={<UserPage currentUser={currentUser} onLogout={handleLogout} />} />
                            {/* 내가 쓴 글 라우트 (MyPosts 컴포넌트 사용) */}
                            <Route path="posts" element={<MyPosts currentUser={currentUser} />} /> {/* currentUser prop 추가 */}
                        </Route>

                        {/* 공지사항 페이지 라우트 추가 */}
                        <Route path="/notice" element={isLoggedIn ? (
                            <Notice currentUser={currentUser} />
                        ) : (
                            <div className="initial-login-screen">
                                로그인이 필요합니다. <button onClick={() => setIsLoginModalOpen(true)}>로그인</button>
                            </div>
                        )} />

                        {/* 기존 UserPage 라우트는 /mypage/edit으로 이동했으므로 필요에 따라 제거하거나 리다이렉트 처리 */}
                        <Route path="/userpage" element={<Navigate to="/mypage/edit" replace />} />


                        <Route path="/signup" element={<SignupForm />} />

                        {/* 정의되지 않은 모든 경로를 위한 404 페이지 */}
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

// App.js 내부에서 사용될 UserInfo 컴포넌트 정의 (MyPage.js에도 동일하게 정의되어 있어야 합니다.)
function UserInfo({ userData }) {
    if (!userData) return <p>사용자 정보를 불러올 수 없습니다.</p>;
    return (
        <div className="user-info-section">
            <div className="profile-image-container">
                <img src={userData.userProfileImageUrl || 'https://via.placeholder.com/150'} alt="프로필 이미지" className="profile-6.profile-image" />
            </div>
            <div className="user-details">
                <p><strong>아이디:</strong> {userData.userLoginId}</p>
                <p><strong>닉네임:</strong> {userData.userNickname}</p>
                <p><strong>이메일:</strong> {userData.userEmail}</p>
                <p><strong>이름:</strong> {userData.userName}</p>
                <p><strong>소개:</strong> {userData.userBio || '작성된 소개가 없습니다.'}</p>
                <p><strong>가입일:</strong> {new Date(userData.createDate).toLocaleDateString()}</p>
            </div>
        </div>
    );
}

export default App;