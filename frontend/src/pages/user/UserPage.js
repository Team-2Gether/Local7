// src/pages/user/UserPage.js
import React, { useState, useEffect } from 'react'; // useState, useEffect 추가
import '../../assets/css/UserPage.css';
import { FaLock } from 'react-icons/fa';
import UserLoginIdSection from '../user/components/UserLoginIdSection';
import UserNicknameSection from '../user/components/UserNicknameSection';
import UserWithdrawalSection from '../user/components/UserWithdrawalSection';
import UserPasswordSection from '../user/components/UserPasswordSection';
import UserIMGSection from '../user/components/UserIMGSection';
import UserBioSection from '../user/components/UserBioSection';
import useMessageDisplay from '../user/hook/useMessageDisplay';

function UserPage() { // currentUser, onLogout props를 UserPage 내부에서 관리
    const { message, messageType, displayMessage } = useMessageDisplay();

    // currentUser 상태를 UserPage에서 관리하며 sessionStorage에서 초기화
    const [currentUser, setCurrentUser] = useState(() => {
        const storedUser = sessionStorage.getItem('currentUser');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    // currentUser 상태가 변경될 때마다 sessionStorage 업데이트
    useEffect(() => {
        if (currentUser) {
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        } else {
            sessionStorage.removeItem('currentUser');
        }
    }, [currentUser]);

    // 로그아웃 함수 (필요하다면 상위 AppContent로 전달될 수 있음)
    // 여기서는 onLogout prop을 UserPage에서 직접 받지 않고, 필요하다면 내부에서 정의하거나
    // 각 컴포넌트가 직접 currentUser를 업데이트하도록 처리합니다.
    // 닉네임, 자기소개 변경은 로그아웃을 유발하지 않으므로, onLogout을 직접 전달할 필요가 없습니다.

    // currentUser가 없을 경우 로딩 스피너나 로그인 유도 메시지 표시
    if (!currentUser) {
        return (
            <div className="user-page-container">
                <p>사용자 정보를 불러오는 중입니다. 로그인되어 있지 않다면 로그인해주세요.</p>
            </div>
        );
    }

    return (
        <div className="user-page-container">
            {message && (
                <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            <div className="user-page-header">
                <h2>회원 정보 관리</h2>
            </div>
            <div className="user-sections-grid">
                {/* 프로필 이미지 변경 섹션 */}
                {/* UserIMGSection도 currentUser 변경이 필요할 경우 setCurrentUser 전달 필요 */}
                <UserIMGSection currentUser={currentUser} setCurrentUser={setCurrentUser} />

                {/* 자기소개 변경 섹션 */}
                {/* currentUser와 setCurrentUser prop 전달 */}
                <UserBioSection currentUser={currentUser} setCurrentUser={setCurrentUser} />

                {/* 닉네임 변경 섹션 */}
                {/* currentUser와 setCurrentUser prop 전달 */}
                <UserNicknameSection currentUser={currentUser} setCurrentUser={setCurrentUser} />

                {/* 아이디 변경 섹션 */}
                {/* 아이디 변경은 보통 로그아웃을 유발하므로 onLogout 유지 (필요 시) */}
                <UserLoginIdSection currentUser={currentUser} onLogout={() => { /* 실제 로그아웃 처리 */ }} />

                {/* 비밀번호 변경 섹션 */}
                <UserPasswordSection currentUser={currentUser} onLogout={() => { /* 실제 로그아웃 처리 */ }} />

                {/* 회원 탈퇴 섹션 */}
                <UserWithdrawalSection currentUser={currentUser} onLogout={() => { /* 실제 로그아웃 처리 */ }} />
            </div>
        </div>
    );
}

export default UserPage;