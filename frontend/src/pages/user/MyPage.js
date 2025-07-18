// MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet } from 'react-router-dom'; // Outlet 추가
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

    if (loading) {
        return <div className="my-page-container">로딩 중입니다...</div>;
    }

    if (error) {
        return <div className="my-page-container error-message">{error}</div>;
    }

    return (
        <div className="my-page-container">
            <h1 className="my-page-title">마이 페이지</h1>
            <div className="my-page-content"> {/* 새로운 div로 컨텐츠를 묶습니다. */}
                <div className="my-page-navigation"> {/* 왼쪽에 배치될 네비게이션 섹션 */}
                    <ul>
                        <li><Link to="/mypage" className="nav-link">내 정보</Link></li> {/* 기본 자식 라우트가 렌더링되도록 to="/mypage"로 변경 */}
                        <li><Link to="/mypage/edit" className="nav-link">회원 정보 수정</Link></li> {/* UserPage 링크 (예시 경로) */}
                        <li><Link to="/mypage/posts" className="nav-link">내가 쓴 글</Link></li> {/* 내가 쓴 글 링크 추가 */}
                        {/* 다른 마이 페이지 메뉴 항목들을 여기에 추가할 수 있습니다. */}
                    </ul>
                </div>
                <div className="my-page-main-content"> {/* Outlet이 렌더링될 영역 */}
                    {/* 자식 라우트가 여기에 렌더링됩니다. 기본적으로는 UserInfo 섹션이 보여집니다. */}
                    <Outlet />
                </div>
            </div>
        </div>
    );
}

export default MyPage;