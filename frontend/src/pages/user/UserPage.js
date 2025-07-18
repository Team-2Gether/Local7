// src/pages/user/UserPage.js
import React from 'react';
import '../../assets/css/UserPage.css';
import { FaLock } from 'react-icons/fa';
import UserLoginIdSection from '../user/components/UserLoginIdSection';
import UserNicknameSection from '../user/components/UserNicknameSection';
import UserWithdrawalSection from '../user/components/UserWithdrawalSection';
import UserPasswordSection from '../user/components/UserPasswordSection';
import UserIMGSection from '../user/components/UserIMGSection';
import UserBioSection from '../user/components/UserBioSection'; // 새로 추가된 import
import useMessageDisplay from '../user/hook/useMessageDisplay';

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
                    {/* 프로필 이미지 변경 섹션 */}
                    <UserIMGSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 자기소개 변경 섹션 */}
                    <UserBioSection currentUser={currentUser} /> {/* 새로 추가된 컴포넌트 */}

                    {/* 닉네임 변경 섹션 */}
                    <UserNicknameSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 아이디 변경 섹션 */}
                    <UserLoginIdSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 비밀번호 변경 섹션 */}
                    <UserPasswordSection currentUser={currentUser} onLogout={onLogout} />

                    {/* 회원 탈퇴 섹션 */}
                    <UserWithdrawalSection currentUser={currentUser} onLogout={onLogout} />
                </div>
            </div>
        </div>
    );
}

export default UserPage;