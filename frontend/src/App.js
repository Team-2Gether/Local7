import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal'; 
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Home from './pages/home/Home';
import LoginForm from './pages/login/LoginForm';
import PostList from './pages/post/components/PostList'; 
import PostForm from './pages/post/PostForm'; 
import NotFoundPage from './components/404page/NotFoundPage';
import sea from './assets/images/sea.png';
import ko from './assets/images/ko.png';
import first from './assets/images/first.png';
import './App.css'; 

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

                {/* 회원가입 페이지: 로그인 상태와 무관하게 항상 접근 가능 */}
                <Route path="/signup" element={<SignupForm />} />

                {/* 게시글 관련 라우트: 로그인 상태와 무관하게 항상 접근 가능 */}
                <Route path="/posts" element={<PostList />} /> {/* 게시글 목록 */}
                <Route path="/posts/new" element={<PostForm />} /> {/* 새 게시글 작성 */}
                <Route path="/posts/edit/:id" element={<PostForm />} /> {/* 게시글 수정 (ID 파라미터) */}


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