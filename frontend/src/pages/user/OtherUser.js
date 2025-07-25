// src/pages/user/OtherUser.js
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import OtherUserPosts from './OtherUserPosts';
import '../../assets/css/OtherUser.css'; // OtherUser.css 경로

function OtherUser({ currentUser }) {
    const { userLoginId } = useParams();
    const [otherUserProfile, setOtherUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);


    useEffect(() => {
        const fetchUserProfileAndFollowStatus = async () => {
            setLoading(true);
            setError(null);

            if (!userLoginId || userLoginId === 'undefined') {
                setError('유효하지 않은 사용자 ID입니다.');
                setLoading(false);
                return;
            }

            try {
                // 1. 사용자 프로필 조회
                const userProfileResponse = await axios.get(`http://192.168.0.10:8080/api/user/profile/loginid/${userLoginId}`);
                if (userProfileResponse.status === 200 && userProfileResponse.data.status === "success") {
                    const profileData = userProfileResponse.data.userProfile;
                    setOtherUserProfile(profileData);

                    // 2. 팔로우 상태 확인 (현재 로그인한 사용자가 있을 때만)
                    if (currentUser && currentUser.userId && profileData.userId) {
                        const followStatusResponse = await axios.get(`http://192.168.0.10:8080/api/follows/status`, {
                            params: {
                                followerId: currentUser.userId,
                                followingId: profileData.userId
                            }
                        });
                        if (followStatusResponse.status === 200) {
                            setIsFollowing(followStatusResponse.data.isFollowing);
                        }
                    }

                    // 3. 팔로워 및 팔로잉 수 가져오기
                    const targetUserId = profileData.userId;
                    if (targetUserId) {
                        try {
                            const followerCountResponse = await axios.get(`http://192.168.0.10:8080/api/follows/followers/count/${targetUserId}`);
                            if (followerCountResponse.status === 200) {
                                setFollowerCount(followerCountResponse.data.followerCount);
                            } else {
                                console.error("팔로워 수를 가져오는 데 실패했습니다.");
                            }
                        } catch (err) {
                            console.error("팔로워 수 조회 중 오류 발생:", err);
                        }

                        try {
                            const followingCountResponse = await axios.get(`http://192.168.0.10:8080/api/follows/followings/count/${targetUserId}`);
                            if (followingCountResponse.status === 200) {
                                setFollowingCount(followingCountResponse.data.followingCount);
                            } else {
                                console.error("팔로잉 수를 가져오는 데 실패했습니다.");
                            }
                        } catch (err) {
                            console.error("팔로잉 수 조회 중 오류 발생:", err);
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
    }, [userLoginId, currentUser]);

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
            const response = await axios.post('http://192.168.0.10:8080/api/follows/toggle', {
                followerId: currentUser.userId,
                followingId: otherUserProfile.userId,
                createdId: currentUser.userLoginId,
                updatedId: currentUser.userLoginId
            });

            if (response.status === 200 && response.data.success) {
                setIsFollowing(response.data.isFollowing);
                alert(response.data.message);
                if (response.data.isFollowing) {
                    setFollowerCount(prev => prev + 1);
                } else {
                    setFollowerCount(prev => prev - 1);
                }
            } else {
                alert(response.data.message || "팔로우/언팔로우 실패");
            }
        } catch (error) {
            console.error('팔로우/언팔로우 중 오류 발생:', error);
            alert("팔로우/언팔로우 요청 중 오류가 발생했습니다.");
        }
    };

    if (loading) {
        return <div className="OtherUser-container loading">사용자 프로필을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="OtherUser-container error-message">오류: {error}</div>;
    }

    if (!otherUserProfile) {
        return <div className="OtherUser-container no-user">사용자를 찾을 수 없습니다.</div>;
    }

    const showFollowButton = currentUser && currentUser.userId !== otherUserProfile.userId;

    return (
        <div className="OtherUser-page">
            <div className="OtherUser-info-section">
                <h2 className="OtherUser-profile-title">{otherUserProfile.userNickname}님의 프로필</h2>
                <div className="OtherUser-profile-image-container">
                    <img
                        src={otherUserProfile.userProfileImageUrl || "https://via.placeholder.com/150"}
                        alt="프로필 이미지"
                        className="OtherUser-profile-image1"
                    />
                </div>
                <div className="OtherUser-user-details">
                    <p><strong>아이디 : </strong> {otherUserProfile.userLoginId}</p>
                    <p><strong>닉네임 : </strong> {otherUserProfile.userNickname}</p>
                    <p><strong>이메일 : </strong> {otherUserProfile.userEmail}</p>
                    <p><strong>이름 : </strong> {otherUserProfile.userName}</p>
                    <p><strong>소개 : </strong> {otherUserProfile.userBio || "작성된 소개가 없습니다."}</p>
                    <p><strong>가입일 : </strong> {new Date(otherUserProfile.createDate).toLocaleDateString()}</p>
                    <p>
                        <strong>팔로워 : </strong> <Link to={`/user/profile/${otherUserProfile.userId}/followers`}>{followerCount}</Link>
                    </p>
                    <p>
                        <strong>팔로잉 : </strong> <Link to={`/user/profile/${otherUserProfile.userId}/followings`}>{followingCount}</Link>
                    </p>
                </div>
                {showFollowButton && (
                    <button onClick={handleFollowToggle} className="OtherUser-follow-button">
                        {isFollowing ? '언팔로우' : '팔로우'}
                    </button>
                )}
            </div>
            <OtherUserPosts userId={otherUserProfile.userId} />
        </div>
    );
}

export default OtherUser;