// src/pages/user/OtherUser.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
// import '../user/User.css';
import MyPosts from './MyPosts';

function OtherUser({ currentUser }) {
    const { userLoginId } = useParams();
    const [otherUserProfile, setOtherUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            // userLoginId가 유효한지 먼저 확인
            if (!userLoginId || userLoginId === 'undefined') {
                setError('유효하지 않은 사용자 ID입니다.');
                setLoading(false);
                return;
            }

            try {
                // 로그인 ID로 사용자 프로필 조회 API 호출
                const response = await axios.get(`http://localhost:8080/api/user/profile/loginid/${userLoginId}`);
                if (response.status === 200) {
                    setOtherUserProfile(response.data.userProfile);
                } else {
                    setError(response.data.message || '사용자 프로필을 불러오지 못했습니다.');
                }
            } catch (err) {
                console.error('Failed to fetch user profile:', err);
                setError('사용자 프로필을 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile(); // 항상 호출
    }, [userLoginId]); // userLoginId가 변경될 때마다 재실행

    if (loading) {
        return <div className="user-profile-container loading">사용자 프로필을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="user-profile-container error-message">오류: {error}</div>;
    }

    if (!otherUserProfile) {
        return <div className="user-profile-container no-user">사용자를 찾을 수 없습니다.</div>;
    }

    return (
        <div className="other-user-page">
            <div className="user-info-section">
                <h2 className="user-profile-title">{otherUserProfile.userNickname}님의 프로필</h2>
                <div className="profile-image-container">
                    <img
                        src={otherUserProfile.userProfileImageUrl || "https://via.placeholder.com/150"}
                        alt="프로필 이미지"
                        className="profile-6.profile-image"
                    />
                </div>
                <div className="user-details">
                    <p><strong>아이디:</strong> {otherUserProfile.userLoginId}</p>
                    <p><strong>닉네임:</strong> {otherUserProfile.userNickname}</p>
                    <p><strong>이메일:</strong> {otherUserProfile.userEmail}</p>
                    <p><strong>이름:</strong> {otherUserProfile.userName}</p>
                    <p><strong>소개:</strong> {otherUserProfile.userBio || "작성된 소개가 없습니다."}</p>
                    <p><strong>가입일:</strong> {new Date(otherUserProfile.createDate).toLocaleDateString()}</p>
                </div>
            </div>

            <div className="other-user-posts-section">
                <h3>{otherUserProfile.userNickname}님이 작성한 게시글</h3>
                <MyPosts currentUser={currentUser} targetUserId={otherUserProfile.userId} />
            </div>
        </div>
    );
}

export default OtherUser;