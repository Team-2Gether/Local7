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

    // Kakao Map initialization and CustomOverlay
    useEffect(() => {
        if (isLoggedIn && window.kakao) {
            const container = document.getElementById('korea-map');
            const options = {
                center: new window.kakao.maps.LatLng(36, 128), // Center of South Korea
                level:30
            };
            const map = new window.kakao.maps.Map(container, options);

            // 7번국도 (National Road 7) approximate coordinates (example)
            const linePath = [
                new window.kakao.maps.LatLng(38.2104, 128.5913), // Sokcho
                new window.kakao.maps.LatLng(37.8813, 128.8292), // Gangneung
                new window.kakao.maps.LatLng(37.3850, 129.1210), // Donghae
                new window.kakao.maps.LatLng(36.5309, 129.4207), // Uljin
                new window.kakao.maps.LatLng(35.5384, 129.3114), // Pohang
                new window.kakao.maps.LatLng(35.1531, 129.1183), // Busan
            ];

            const polyline = new window.kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 4,
                strokeColor: '#FF0000',
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
            });
            polyline.setMap(map);

            // Custom Overlay
            const customOverlay = new window.kakao.maps.CustomOverlay({
                content: `<img src="../korea.png" style="width:ce;">`, // Make sure you have this image in your public/images folder
                position: new window.kakao.maps.LatLng(37.5, 128), // Position at the center of the map
                xAnchor: 0.5,
                yAnchor: 0.5
            });
            customOverlay.setMap(map);
        }
    }, [isLoggedIn]);

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
            
            {isLoggedIn && (
                <>
                    <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />

                    <div className="main-app-content">
                        {/* Top Black Header - Map + Description */}
                        <div className="black-header">
                            <div className="map-and-text">
                                <div id="korea-map" className="korea-map" style={{ width: "400px", height: "300px" }}></div>
                                <div className="description">
                                    <h1>속초<span>__SOKCHO</span></h1>
                                    <p>
                                        속초는 6.25전쟁 당시 북한에서 내려온 피란민들이 정착한 곳으로,
                                        그들의 향수와 생활 방식이 음식 문화에 깊이 스며들어 있다.
                                        이곳의 음식은 단순한 맛을 넘어 역사와 삶의 이야기를 닮고있다.
                                    </p>
                                    <div className="button-group">
                                        <button>게시글</button>
                                        <button>맛집</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 4 Photos */}
                        <div className="photo-strip">
                            <img src="/images/photo1.jpg" alt="사진1" />
                            <img src="/images/photo2.jpg" alt="사진2" />
                            <img src="/images/photo3.jpg" alt="사진3" />
                            <img src="/images/photo4.jpg" alt="사진4" />
                        </div>

                        {/* Bottom Section: Photo + Comments + Map */}
                        <div className="bottom-section">
                            <div className="left-content">
                                <img src="/images/kyungju-night.jpg" alt="경주" />
                                <div className="comments">
                                    <div><strong>user001:</strong> 경주야경 정말 잘됐네요~</div>
                                    <div><strong>맛집탐방:</strong> 휴가를 떠나고 싶습니까?~</div>
                                    <input type="text" placeholder="댓글을 입력하세요" />
                                </div>
                            </div>
                            <div className="right-map">
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18..."
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="map"
                                ></iframe>
                            </div>
                        </div>
                    </div>
                </>
                
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