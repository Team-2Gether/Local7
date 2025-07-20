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
import FollowerList from "./pages/user/FollowerList"; // FollowerList import
import FollowingList from "./pages/user/FollowingList"; // FollowingList import
import AdminPage from "./pages/admin/AdminPage";
import ForgetIdOrPWD from "./pages/forget/ForgetIdOrPWD";


Modal.setAppElement("#root");

export function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
    const [isAiModalOpen, setIsAiModalOpen] = useState(false);
    const [selectedCity, setSelectedCity] = useState("전체");

    const navigate = useNavigate();

    axios.defaults.withCredentials = true;

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
            const response = await axios.post("http://localhost:8080/api/auth/logout");
            const data = response.data;
            if (response.status === 200) {
                alert(data.message);
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigate("/");
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

                        <Route path="/signup" element={<SignupForm />} />
                        <Route path="/admin" element={currentUser && currentUser.ruleId === 1 ? <AdminPage currentUser={currentUser} /> : <Navigate to="/" />} />
                        <Route path="/forget-ID-PWD" element={<ForgetIdOrPWD />} /> {/* */}
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
                    onOpenTermsModal={openTermsModal} />
            </Modal>

            <TermsOfServiceModal
                isOpen={isTermsModalOpen}
                onClose={closeTermsModal}
                showAgreeButton={false} />

            <AiModal isOpen={isAiModalOpen} onRequestClose={() => setIsAiModalOpen(false)} />
        </div>
    );
}

function UserInfo({ currentUser }) {
    const [userData, setUserData] = useState(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { userLoginId } = useParams();

    useEffect(() => {
        const fetchUserDataAndFollowCounts = async () => {
            setIsLoading(true);
            setError(null);

            let targetUserLoginId = currentUser?.userLoginId;
            let targetUserId = currentUser?.userId;

            if (currentUser && currentUser.userId) {
                targetUserLoginId = currentUser.userLoginId;
                targetUserId = currentUser.userId;
            } else {
                setError("사용자 정보를 불러올 수 없습니다.");
                setIsLoading(false);
                return;
            }

            try {
                const userProfileResponse = await axios.get(`http://localhost:8080/api/user/profile/loginid/${targetUserLoginId}`);
                if (userProfileResponse.data.status === "success") {
                    setUserData(userProfileResponse.data.userProfile);
                    targetUserId = userProfileResponse.data.userProfile.userId;
                } else {
                    console.error("사용자 프로필을 가져오는 데 실패했습니다:", userProfileResponse.data.message);
                    setUserData(null);
                    setError(userProfileResponse.data.message || "사용자 프로필을 불러오는 데 실패했습니다.");
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error("사용자 프로필 조회 중 오류 발생:", error);
                setUserData(null);
                setError("사용자 프로필을 불러오는 중 오류가 발생했습니다.");
                setIsLoading(false);
                return;
            }

            if (targetUserId) {
                try {
                    const followerCountResponse = await axios.get(`http://localhost:8080/api/follows/followers/count/${targetUserId}`);
                    if (followerCountResponse.status === 200) {
                        setFollowerCount(followerCountResponse.data.followerCount);
                    } else {
                        console.error("팔로워 수를 가져오는 데 실패했습니다.");
                    }
                } catch (error) {
                    console.error("팔로워 수 조회 중 오류 발생:", error);
                }

                try {
                    const followingCountResponse = await axios.get(`http://localhost:8080/api/follows/followings/count/${targetUserId}`);
                    if (followingCountResponse.status === 200) {
                        setFollowingCount(followingCountResponse.data.followingCount);
                    } else {
                        console.error("팔로잉 수를 가져오는 데 실패했습니다.");
                    }
                } catch (error) {
                    console.error("팔로잉 수 조회 중 오류 발생:", error);
                }
            }
            setIsLoading(false);
        };

        fetchUserDataAndFollowCounts();
    }, [currentUser]);

    if (isLoading) {
        return <p>사용자 정보를 불러오는 중입니다...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!userData)
        return <p>사용자 정보를 불러올 수 없습니다.</p>;

    return (
        <div className="user-info-section">
            <div className="profile-image-container">
                <img
                    src={userData.userProfileImageUrl || "https://via.placeholder.com/150"
                    }
                    alt="프로필 이미지"
                    className="profile-image" />
            </div>
            <div className="user-details">
                <p>
                    <strong>아이디:</strong>
                    {userData.userLoginId}
                </p>
                <p>
                    <strong>닉네임:</strong>
                    {userData.userNickname}
                </p>
                <p>
                    <strong>이메일:</strong>
                    {userData.userEmail}
                </p>
                <p>
                    <strong>이름:</strong>
                    {userData.userName}
                </p>
                <p>
                    <strong>소개:</strong>
                    {userData.userBio || "작성된 소개가 없습니다."}
                </p>
                <p>
                    <strong>가입일:</strong>{" "}
                    {new Date(userData.createDate).toLocaleDateString()}
                </p>
                <p>
                    <strong>팔로워:</strong> {followerCount}
                </p>
                <p>
                    <strong>팔로잉:</strong> {followingCount}
                </p>
            </div>
        </div>
    );
}