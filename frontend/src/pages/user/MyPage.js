// MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Link 추가
import axios from 'axios';
import '../../assets/css/MyPage.css'; // MyPage.css 파일을 import 합니다.

// MyPage 컴포넌트는 currentUser와 isLoggedIn을 props로 받습니다.
function MyPage({ currentUser, isLoggedIn }) {
    const [userData, setUserData] = useState(currentUser); // currentUser prop을 초기 상태로 사용
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("MyPage mounted. isLoggedIn:", isLoggedIn, "currentUser:", currentUser); // MyPage 로드 시 확인
        if (isLoggedIn && currentUser) {
            setUserData(currentUser);
            setLoading(false);
            console.log("MyPage: User data set.", currentUser); // 데이터 설정 확인
        } else {
            setError("사용자 정보를 불러오지 못했습니다.");
            setLoading(false);
            console.log("MyPage: Error loading user data."); // 오류 발생
        }
    }, [currentUser, isLoggedIn, navigate]);

    return (
        <div>
            <h1 className="my-page-title">마이 페이지</h1>
            <div className="my-page-content"> {/* 새로운 div로 컨텐츠를 묶습니다. */}
                <div className="my-page-navigation"> {/* 왼쪽에 배치될 네비게이션 섹션 */}
                    <ul>
                        <li><Link to="/mypage" className="nav-link active">내 정보</Link></li>
                        <li><Link to="/userpage" className="nav-link">회원 정보 수정</Link></li> {/* UserPage 링크 추가 */}
                        {/* 다른 마이 페이지 메뉴 항목들을 여기에 추가할 수 있습니다. */}
                    </ul>
                </div>
                <div className="user-info-section"> {/* 기존 사용자 정보 섹션 */}
                    <div className="profile-image-container">
                        <img src={userData.userProfileImageUrl || 'https://via.placeholder.com/150'} alt="프로필 이미지" className="profile-image" />
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
            </div>
        </div>
    );
}

export default MyPage;