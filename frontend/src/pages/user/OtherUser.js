// src/pages/user/OtherUser.js
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import OtherUserPosts from './OtherUserPosts'; // OtherUserPosts 컴포넌트 import 추가

function OtherUser({ currentUser }) {
    const { userLoginId } = useParams();
    const [otherUserProfile, setOtherUserProfile] = useState(null);
    const [loading, setLoading] = useState(true); // 수정된 부분: (true) -> useState(true)
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태 추가

    useEffect(() => {
        const fetchUserProfileAndFollowStatus = async () => {
            if (!userLoginId || userLoginId === 'undefined') {
                setError('유효하지 않은 사용자 ID입니다.');
                setLoading(false);
                return;
            }

            try {
                // 사용자 프로필 조회
                const userProfileResponse = await axios.get(`http://localhost:8080/api/user/profile/loginid/${userLoginId}`);
                if (userProfileResponse.status === 200) {
                    const profileData = userProfileResponse.data.userProfile;
                    setOtherUserProfile(profileData);

                    // 팔로우 상태 확인 (현재 로그인한 사용자가 있을 때만)
                    if (currentUser && currentUser.userId && profileData.userId) {
                        const followStatusResponse = await axios.get(`http://localhost:8080/api/follows/status`, {
                            params: {
                                followerId: currentUser.userId,
                                followingId: profileData.userId
                            }
                        });
                        if (followStatusResponse.status === 200) {
                            setIsFollowing(followStatusResponse.data.isFollowing);
                        }
                    }
                } else {
                    setError(userProfileResponse.data.message || '사용자 프로필을 불러오지 못했습니다.');
                }
            } catch (err) {
                console.error('Failed to fetch user profile or follow status:', err);
                setError('사용자 프로필 또는 팔로우 상태를 불러오는 중 오류가 발생했습니다.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfileAndFollowStatus();
    }, [userLoginId, currentUser]); // userLoginId 또는 currentUser 변경 시 재실행

    const handleFollowToggle = async () => {
        if (!currentUser || !currentUser.userId) {
            alert("로그인이 필요합니다.");
            return;
        }
        if (!otherUserProfile || !otherUserProfile.userId) {
            alert("사용자 정보를 찾을 수 없습니다.");
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/follows/toggle', {
                followerId: currentUser.userId,
                followingId: otherUserProfile.userId,
                createdId: currentUser.userLoginId, // 현재 로그인한 사용자의 userLoginId
                updatedId: currentUser.userLoginId  // 현재 로그인한 사용자의 userLoginId
            });

            if (response.status === 200 && response.data.success) {
                setIsFollowing(response.data.isFollowing);
                alert(response.data.message);
            } else {
                alert(response.data.message || "팔로우/언팔로우 실패");
            }
        } catch (error) {
            console.error('팔로우/언팔로우 중 오류 발생:', error);
            alert("팔로우/언팔로우 요청 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="user-profile-container loading">사용자 프로필을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="user-profile-container error-message">오류: {error}</div>;
    }

    if (!otherUserProfile) {
        return <div className="user-profile-container no-user">사용자를 찾을 수 없습니다.</div>;
    }

    // 현재 접속한 유저와 프로필의 유저가 다를 경우에만 팔로우 버튼 표시
    const showFollowButton = currentUser && currentUser.userId !== otherUserProfile.userId;

    return (
        <div className="other-user-page">
            <div className="user-info-section">
                <h2 className="user-profile-title">{otherUserProfile.userNickname}님의 프로필</h2>
                <div className="profile-image-container">
                    <img
                        src={otherUserProfile.userProfileImageUrl || "https://via.placeholder.com/150"}
                        alt="프로필 이미지"
                        className="profile-image"
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
                {showFollowButton && (
                    <button onClick={handleFollowToggle} className="follow-button">
                        {isFollowing ? '언팔로우' : '팔로우'}
                    </button>
                )}
            </div>
            {/* OtherUserPosts 컴포넌트 추가 */}
            <OtherUserPosts userId={otherUserProfile.userId} />
        </div>
    );
}

export default OtherUser; 