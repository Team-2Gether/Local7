// MyPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate, NavLink, Outlet } from 'react-router-dom'; // Link 대신 NavLink를 import 합니다.
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
                        {/* NavLink 사용: activeStyle과 activeClassName은 v6에서 deprecated되어 isActive prop과 className 함수를 사용합니다. */}
                        <li>
                            <NavLink
                                to="/mypage"
                                end // "/mypage" 경로에만 active 클래스가 적용되도록 합니다.
                                className={({ isActive }) => (isActive ? "nav-link1 active" : "nav-link1")}
                            >
                                내 정보
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/mypage/edit"
                                className={({ isActive }) => (isActive ? "nav-link1 active" : "nav-link1")}
                            >
                                회원 정보 수정
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to="/mypage/posts"
                                className={({ isActive }) => (isActive ? "nav-link1 active" : "nav-link1")}
                            >
                                내가 쓴 글
                            </NavLink>
                        </li>
                        {/* 팔로워/팔로잉 링크 수정: 현재 로그인된 사용자의 ID를 포함하도록 */}
                        <li>
                            <NavLink
                                to={`/mypage/followers`}
                                className={({ isActive }) => (isActive ? "nav-link1 active" : "nav-link1")}
                            >
                                팔로워
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to={`/mypage/followings`}
                                className={({ isActive }) => (isActive ? "nav-link1 active" : "nav-link1")}
                            >
                                팔로잉
                            </NavLink>
                        </li>
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