import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import SignupForm from './pages/signup/SignupPage';
import Navbar from './components/Navbar';
import Main from './pages/home/main';
import LoginForm from './pages/login/LoginForm';
import PostList from './pages/post/components/PostList';
import PostForm from './pages/post/PostForm';
import NotFoundPage from './components/404page/NotFoundPage';
import TermsOfServiceModal from './components/TermsOfServiceModal'; // TermsOfServiceModal import
import sea from './assets/images/sea.png';
import ko from './assets/images/ko.png';
import first from './assets/images/first.png';
import './App.css';

Modal.setAppElement('#root');

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false); // TermsOfServiceModal 상태 추가
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

    // 이용약관 모달 열기/닫기 함수
    const openTermsModal = () => setIsTermsModalOpen(true);
    const closeTermsModal = () => setIsTermsModalOpen(false);

    return (
        <>
            {/* Navbar는 로그인된 경우에만 표시 */}
            {isLoggedIn && (
                <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />
            )}

            <Routes>
                {/* 루트 경로: 로그인 상태에 따라 Home 컴포넌트 또는 초기 로그인 화면 표시 */}
                <Route path="/" element={isLoggedIn ? (
                    // 로그인된 경우: Home 컴포넌트가 내부적으로 사이드바를 포함하도록 변경
                    <Main currentUser={currentUser} />
                ) : (
                    <div className="initial-login-screen"> {/* 로그인 안 된 초기 화면 */}
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

                <Route path="/posts" element={<PostList />} /> 
                <Route path="/posts/new" element={<PostForm />} /> 
                <Route path="/posts/edit/:id" element={<PostForm />} />


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
                <LoginForm onLoginSuccess={handleLoginSuccess} onCloseModal={() => setIsLoginModalOpen(false)} onOpenTermsModal={openTermsModal} /> {/* onOpenTermsModal prop 전달 */}
            </Modal>

            {/* 이용약관 모달 */}
            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={closeTermsModal}
                showAgreeButton={false} // 로그인 폼에서 약관을 보여줄 때는 '동의하기' 버튼이 필요 없을 수 있음
            />
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
