// src/AppContent.js
import React, { useState, useEffect } from "react";
import { Routes, Route, useNavigate, Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Modal from "react-modal";

import "./App.css";

import SignupForm from "./pages/signup/SignupPage";
import Navbar from "./components/Navbar";
import Restaurant from "./pages/restaurant/Restaurant";
import LoginForm from "./pages/login/LoginForm";
import NotFoundPage from "./components/404page/NotFoundPage";
import TermsOfServiceModal from "./components/TermsOfServiceModal";
import MyPage from "./pages/user/MyPage";
import UserPage from "./pages/user/UserPage";
import Sidebar from "./components/Sidebar";
import AiModal from "./pages/ai/components/AiModal";
import Home from "./pages/home/Home";
import RestaurantVote from "./pages/vote/VotePage";
import PostForm from "./pages/post/PostForm";
import sea from "./assets/images/sea.png";
import ko from "./assets/images/ko.png";
import first from "./assets/images/first.png";
import MyPosts from "./pages/user/MyPosts";
import PostList from "./pages/post/components/PostList";
import PostDetail from "./pages/post/components/PostDetail";
import Notice from "./pages/notice/Notice";
import OtherUser from "./pages/user/OtherUser";
import FollowerList from "./pages/user/FollowerList";
import FollowingList from "./pages/user/FollowingList";
import AdminPage from "./pages/admin/AdminPage";
import ForgetIdOrPWD from "./pages/forget/ForgetIdOrPWD";
import SearchUser from "./pages/searchuser/SearchUser";
import OAuth2RedirectHandler from './pages/OAuth2RedirectHandler';
import UserInfo from "./pages/user/UserInfo"; // 분리된 UserInfo 컴포넌트 임포트

Modal.setAppElement("#root");

export function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("전체");

    // 새로 추가된 모달 상태
    const [isSignupModalOpen, setIsSignupModalOpen] = useState(false);
    const [isForgetIdPwdModalOpen, setIsForgetIdPwdModalOpen] = useState(false);


    const navigate = useNavigate();

    // Axios 기본 설정: 모든 요청에 자격 증명(쿠키) 포함
    axios.defaults.withCredentials = true;

    // Axios 요청 인터셉터: CSRF 토큰을 요청 헤더에 추가
    // Spring Security의 CookieCsrfTokenRepository.withHttpOnlyFalse()와 연동됩니다.
    axios.interceptors.request.use(config => {
        // 'XSRF-TOKEN' 쿠키에서 CSRF 토큰 값을 찾습니다.
        const csrfToken = document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN='));

        // 토큰이 존재하면 'X-XSRF-TOKEN' 헤더에 추가합니다.
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = csrfToken.split('=')[1];
        }
        return config;
    }, error => {
        return Promise.reject(error);
    });

    const checkLoginStatus = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/auth/status");
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
        console.log("로그인 성공", userData);
        navigate("/");
    };

    const handleLogout = async () => {
        try {
            // Spring Security의 HttpStatusReturningLogoutSuccessHandler는 본문을 반환하지 않으므로
            // response.data 대신 response.status만 확인합니다.
            const response = await axios.post("http://localhost:8080/api/auth/logout");
            if (response.status === 200) { // HTTP 200 OK는 성공적인 로그아웃을 의미합니다.
                alert("로그아웃되었습니다."); // 직접 메시지 출력
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigate("/");
            } else {
                // 200 OK가 아닌 다른 상태 코드가 반환될 경우
                alert("로그아웃 실패: 예상치 못한 응답입니다.");
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
            // 서버에서 에러 응답을 보낼 경우 (예: 500 Internal Server Error)
            if (error.response) {
                alert(`로그아웃 중 오류가 발생했습니다: ${error.response.status} ${error.response.statusText}`);
            } else {
                alert("로그아웃 중 네트워크 오류가 발생했습니다.");
            }
        }
    };

    const openTermsModal = () => setIsTermsModalOpen(true);
    const closeTermsModal = () => setIsTermsModalOpen(false);

    // 새로 추가된 모달 열기/닫기 함수
    const openSignupModal = () => {
        setIsLoginModalOpen(false); // 로그인 모달 닫기
        setIsSignupModalOpen(true);
    };
    const closeSignupModal = () => {
        setIsSignupModalOpen(false);
        setIsLoginModalOpen(true); // 회원가입 모달 닫고 로그인 모달 다시 열기
    };

    // 회원가입 성공 시 호출될 함수
    const handleSignupSuccess = () => {
        closeSignupModal(); // 회원가입 모달 닫기
        setIsLoginModalOpen(true); // 로그인 모달 다시 열기
        alert('회원가입이 완료되었습니다. 로그인 해주세요.'); // 사용자에게 메시지 알림
    };


    const openForgetIdPwdModal = () => {
        setIsLoginModalOpen(false); // 로그인 모달 닫기
        setIsForgetIdPwdModalOpen(true);
    };
    const closeForgetIdPwdModal = () => {
        setIsForgetIdPwdModalOpen(false);
        setIsLoginModalOpen(true); // 비밀번호 찾기 모달 닫고 로그인 모달 다시 열기
    };

    const handleSidebarMenuItemClick = (item) => {
        if (item === "ai") {
            setIsAiModalOpen(true);
        } else {
            setIsAiModalOpen(false);
        }
    };

    return (
        <div className="app-layout">
            {
                isLoggedIn && (
                    <div className="navbar-container">
                        <Navbar
                            isLoggedIn={isLoggedIn}
                            userNickname={currentUser
                                ?.userNickname}
                            onLogout={handleLogout} />
                    </div>
                )
            }

            <div className="main-content-area">
                {
                    isLoggedIn && (
                        <div className="sidebar-container">
                            <Sidebar onMenuItemClick={handleSidebarMenuItemClick} currentUser={currentUser} />
                        </div>
                    )
                }

                <div className="content-with-sidebar">
                    <Routes>
                        <Route
                            path="/"
                            element={isLoggedIn
                                ? (
                                    <Home currentUser={currentUser} selectedCity={selectedCity} setSelectedCity={setSelectedCity} />
                                )
                                : (
                                    <div className="initial-login-screen">
                                        <div className="login-image-wrapper">
                                            <img src={sea} alt="sea" className="login-background-image" />
                                            <img src={ko} alt="ko" className="overlay-image ko-image" />
                                            <img src={first} alt="first" className="overlay-image first-image" />
                                            <button
                                                className="login-trigger-button"
                                                onClick={() => setIsLoginModalOpen(true)}>
                                                로그인
                                            </button>
                                        </div>
                                    </div>
                                )} />
                        <Route path="/restaurants" element={<Restaurant currentUser={currentUser} />} />
                        <Route
                            path="/pick"
                            element={<RestaurantVote currentUser={currentUser} />}
                        />
                        <Route
                            path="/posts"
                            element={<PostList currentUser={currentUser} selectedCity={selectedCity} />}
                        />
                        <Route
                            path="/posts/new"
                            element={<PostForm currentUser={
                                currentUser
                            } />
                            }
                        />
                        <Route
                            path="/posts/edit/:id"
                            element={<PostForm currentUser={
                                currentUser
                            } />
                            }
                        />
                        <Route
                            path="/posts/:id"
                            element={<PostDetail currentUser={
                                currentUser
                            } />
                            }
                        />
                        <Route
                            path="/mypage"
                            element={isLoggedIn
                                ? (<MyPage currentUser={currentUser} isLoggedIn={isLoggedIn} />)
                                : (
                                    <div className="initial-login-screen">
                                        로그인이 필요합니다.{" "}
                                        <button onClick={() => setIsLoginModalOpen(true)}>
                                            로그인
                                        </button>
                                    </div>
                                )}>
                            <Route
                                index="index"
                                element={<UserInfo currentUser={currentUser} />
                                }
                            />
                            <Route
                                path="edit"
                                element={<UserPage currentUser={
                                    currentUser
                                }
                                    onLogout={
                                        handleLogout
                                    } />
                                }
                            />
                            <Route
                                path="posts"
                                element={<MyPosts currentUser={
                                    currentUser
                                } />
                                }
                            />
                            {/* MyPage 내부 라우트: 팔로워/팔로잉 목록 */}
                            <Route
                                path="followers"
                                element={<FollowerList currentUser={currentUser} />}
                            />
                            <Route
                                path="followings"
                                element={<FollowingList currentUser={currentUser} />}
                            />
                        </Route>

                        {/* OtherUser 페이지 라우트: 다른 사용자의 프로필 */}
                        <Route path="/user/profile/:userLoginId" element={<OtherUser currentUser={currentUser} />} />
                        {/* 다른 사용자의 팔로워/팔로잉 목록 라우트 추가 - userId를 사용 */}
                        <Route path="/user/profile/:userId/followers" element={<FollowerList currentUser={currentUser} />} />
                        <Route path="/user/profile/:userId/followings" element={<FollowingList currentUser={currentUser} />} />

                        <Route path="/search-user" element={<SearchUser />} />

                        {/* OAuth2RedirectHandler 경로가 src/pages/OAuth2RedirectHandler.js 에 있다면 이 경로를 사용 */}
                        <Route path="/oauth2/redirect" element={<OAuth2RedirectHandler />} />


                        <Route
                            path="/notice/*"
                            element={isLoggedIn
                                ? (<Notice currentUser={currentUser} />)
                                : (
                                    <div className="initial-login-screen">
                                        로그인이 필요합니다.{" "}
                                        <button onClick={() => setIsLoginModalOpen(true)}>
                                            로그인
                                        </button>
                                    </div>
                                )} />
                        <Route path="/userpage" element={<Navigate to="/mypage/edit" replace />} />

                        {/* 이 부분은 이제 모달로 띄우므로 주석 처리하거나 삭제합니다. */}
                        {/* <Route path="/signup" element={<SignupForm />} /> */}
                        {/* <Route path="/forget-ID-PWD" element={<ForgetIdOrPWD />} */}

                        <Route path="/admin" element={currentUser && currentUser.ruleId === 1 ? <AdminPage currentUser={currentUser} /> : <Navigate to="/" />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                </div>
            </div>

            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setIsLoginModalOpen(false)}
                className="login-modal-content"
                overlayClassName="login-modal-overlay"
                contentLabel="로그인 모달">
                <LoginForm
                    onLoginSuccess={handleLoginSuccess}
                    onCloseModal={() => setIsLoginModalOpen(false)}
                    onOpenTermsModal={openTermsModal}
                    onOpenSignupModal={openSignupModal} /* 새로 추가 */
                    onOpenForgetIdPwdModal={openForgetIdPwdModal} /* 새로 추가 */
                />
            </Modal>

            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={closeTermsModal}
                showAgreeButton={false} />

            <AiModal isOpen={isAiModalOpen} onRequestClose={() => setIsAiModalOpen(false)} />

            {/* 회원가입 모달 추가 */}
            <Modal
                isOpen={isSignupModalOpen}
                onRequestClose={closeSignupModal}
                className="signup-modal-content" /* CSS 클래스 필요 */
                overlayClassName="signup-modal-overlay" /* CSS 클래스 필요 */
                contentLabel="회원가입 모달">
                <SignupForm onCloseModal={closeSignupModal} onSignupSuccess={handleSignupSuccess} /> {/* ✅ onSignupSuccess prop 추가 */}
            </Modal>

            {/* ID/비밀번호 찾기 모달 추가 */}
            <Modal
                isOpen={isForgetIdPwdModalOpen}
                onRequestClose={closeForgetIdPwdModal}
                className="forgetIdPwd-modal-content" /* CSS 클래스 필요 */
                overlayClassName="forgetIdPwd-modal-overlay" /* CSS 클래스 필요 */
                contentLabel="ID/비밀번호 찾기 모달">
                <ForgetIdOrPWD onCloseModal={closeForgetIdPwdModal} />
            </Modal>
        </div>
    );
}