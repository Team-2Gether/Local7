// src/pages/user/UserPage.js
import React from 'react';
import '../../assets/css/UserPage.css';import { FaLock } from 'react-icons/fa';
import UserLoginIdSection from '../user/components/UserLoginIdSection'; // 경로 변경됨
import UserNicknameSection from '../user/components/UserNicknameSection'; // 경로 변경됨
import UserPasswordSection from '../user/components/UserPasswordSection'; // 경로 변경됨
import UserWithdrawalSection from '../user/components/UserWithdrawalSection'; // 경로 변경됨
import useMessageDisplay from '../user/hook/useMessageDisplay'; // 경로 변경됨

function UserPage({ currentUser, onLogout }) {
    const { message, messageType } = useMessageDisplay();

    return (
        <div>
            <h2><FaLock /> 내 정보</h2>
            {message && (
                <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="user-page-content">
                <div className="user-update-sections-wrapper">
                    {/* 닉네임 변경 섹션 */}
                    <UserNicknameSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 아이디 변경 섹션 */}
                    <UserLoginIdSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 비밀번호 변경 섹션 */}
                    <UserPasswordSection />

                    {/* 회원 탈퇴 섹션 */}
                    <UserWithdrawalSection onLogout={onLogout} />
                </div>
            </div>
        </div>
    );
}

export default UserPage;

// import '../../assets/css/UserPage.css';