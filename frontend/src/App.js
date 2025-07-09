import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Modal from 'react-modal';
import LoginForm from './pages/login/LoginForm';
import Navbar from './components/Navbar';
import './App.css';

// 리액트 모달 사용시 필수로 setAppElement 지정
Modal.setAppElement('#root');

function AppContent() {
    const [isLoggedIn, setIsLoggedIn] = useState(false); // 로그인 여부
    const [currentUser, setCurrentUser] = useState(null); // 로그인 유저 데이터
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); // 모달 상태
    const navigate = useNavigate();

    // axios 전역 쿠키 포함 설정
    axios.defaults.withCredentials = true;

    // 최초 렌더링시 로그인 상태 확인
    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const response = await axios.get('http://localhost:8080/api/user/status');
                const data = response.data;
                if (response.status === 200 && data.isLoggedIn) {
                    setIsLoggedIn(true);
                    setCurrentUser({
                        userNickname: data.userNickname,
                        userUsername: data.userUsername,
                        userEmail: data.userEmail
                    });
                } else {
                    setIsLoggedIn(false);
                    setCurrentUser(null);
                }
            } catch (error) {
                console.error("로그인 상태 확인 실패:", error);
                setIsLoggedIn(false);
                setCurrentUser(null);
            }
        };
        checkLoginStatus();
    }, []);

    // 카카오맵 초기화 (로그인 상태일 때만)
    useEffect(() => {
        if (isLoggedIn && window.kakao) {
            // 1. 지도 객체 생성
            const container = document.getElementById('korea-map');
            const options = {
                center: new window.kakao.maps.LatLng(36, 128), // 대한민국 중심 좌표
                level: 14 // 줌 레벨 (값이 클수록 멀리서 보기, 작을수록 확대)
            };
            const map = new window.kakao.maps.Map(container, options);

            // 2. 7번국도 도시 리스트
            const cityPoints = [
                { name: "고성", latlng: new window.kakao.maps.LatLng(38.3800, 128.4676) },
                { name: "속초", latlng: new window.kakao.maps.LatLng(38.2104, 128.5913) },
                { name: "양양", latlng: new window.kakao.maps.LatLng(38.0768, 128.6199) },
                { name: "강릉", latlng: new window.kakao.maps.LatLng(37.7520, 128.8761) },
                { name: "동해", latlng: new window.kakao.maps.LatLng(37.5224, 129.1147) },
                { name: "삼척", latlng: new window.kakao.maps.LatLng(37.4475, 129.1651) },
                { name: "울진", latlng: new window.kakao.maps.LatLng(36.9932, 129.4005) },
                { name: "영덕", latlng: new window.kakao.maps.LatLng(36.3504, 129.3657) },
                { name: "포항", latlng: new window.kakao.maps.LatLng(35.9982, 129.4000) },
                { name: "경주", latlng: new window.kakao.maps.LatLng(35.8562, 129.2246) },
                { name: "울산", latlng: new window.kakao.maps.LatLng(35.5396, 129.3110) },
                { name: "부산", latlng: new window.kakao.maps.LatLng(35.1796, 129.0756) }
            ];

            // 3. 도시들을 따라 선(Polyline) 그리기
            const linePath = cityPoints.map(c => c.latlng);
            const polyline = new window.kakao.maps.Polyline({
                path: linePath,
                strokeWeight: 5, // 선 두께
                strokeColor: '#FFCC00', // 선 색상
                strokeOpacity: 0.8,
                strokeStyle: 'solid'
            });
            polyline.setMap(map);

            // ✅ 각 도시 주변에 Polygon(작은 사각형) 표시하기
            cityPoints.forEach(city => {
                const delta = 0.03; // 각 도시를 중심으로 작은 사각형 영역
                const polygonPath = [
                    new window.kakao.maps.LatLng(city.latlng.getLat() - delta, city.latlng.getLng() - delta),
                    new window.kakao.maps.LatLng(city.latlng.getLat() - delta, city.latlng.getLng() + delta),
                    new window.kakao.maps.LatLng(city.latlng.getLat() + delta, city.latlng.getLng() + delta),
                    new window.kakao.maps.LatLng(city.latlng.getLat() + delta, city.latlng.getLng() - delta)
                ];

                const polygon = new window.kakao.maps.Polygon({
                    path: polygonPath,
                    strokeWeight: 2,
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.8,
                    strokeStyle: 'solid',
                    fillColor: '#79AAFF',
                    fillOpacity: 5
                });
                polygon.setMap(map);
            });
        }
    }, [isLoggedIn]);

    // 로그인 성공시 처리
    const handleLoginSuccess = (userData) => {
        setIsLoggedIn(true);
        setCurrentUser(userData);
        setIsLoginModalOpen(false);
        navigate('/');
    };

    // 로그아웃
    const handleLogout = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/user/logout');
            if (response.status === 200) {
                alert(response.data.message);
                setIsLoggedIn(false);
                setCurrentUser(null);
                navigate('/');
            }
        } catch (error) {
            console.error("로그아웃 실패:", error);
            alert("로그아웃 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            {isLoggedIn ? (
                <>
                    <Navbar isLoggedIn={isLoggedIn} userNickname={currentUser?.userNickname} onLogout={handleLogout} />

                    <div className="main-app-content">
                        <div className="black-header">
                            <div className="black-header-all">
                                <button>전체</button>
                            </div>
                            <br />
                            {/* 도시별 버튼 */}
                            <button>고성</button>
                            <button>속초</button>
                            <button>양양</button>
                            <button>강릉</button>
                            <button>동해</button>
                            <button>삼척</button><br></br>
                            <button>울진</button>
                            <button>영덕</button>
                            <button>포항</button>
                            <button>경주</button>
                            <button>울산</button>
                            <button>부산</button>
                            <div className="map-and-text">
                                {/* 카카오 지도 */}
                                <div id="korea-map" className="korea-map" style={{ width: "400px", height: "300px" }}></div>
                                {/* 설명 영역 */}
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

                        {/* 사진 4장 */}
                        <div className="photo-strip">
                            <img src="/images/photo1.jpg" alt="사진1" />
                            <img src="/images/photo2.jpg" alt="사진2" />
                            <img src="/images/photo3.jpg" alt="사진3" />
                            <img src="/images/photo4.jpg" alt="사진4" />
                        </div>

                        {/* 아래 : 사진 + 댓글 + 구글맵 */}
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
            ) : (
                <div className="initial-login-screen">
                    <button
                        className="login-trigger-button initial-center-button"
                        onClick={() => setIsLoginModalOpen(true)}
                    >
                        로그인
                    </button>
                </div>
            )}

            {/* 로그인 모달 */}
            <Modal
                isOpen={isLoginModalOpen}
                onRequestClose={() => setIsLoginModalOpen(false)}
                className="login-modal-content"
                overlayClassName="login-modal-overlay"
                contentLabel="로그인 모달"
            >
                <LoginForm onLoginSuccess={handleLoginSuccess} />
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
