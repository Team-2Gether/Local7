import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../assets/css/UserInfo.css"; // CSS 경로 추가

function UserInfo({ currentUser }) {
    const [userData, setUserData] = useState(null);
    const [followerCount, setFollowerCount] = useState(0);
    const [followingCount, setFollowingCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserDataAndFollowCounts = async () => {
            setIsLoading(true);
            setError(null);

            let targetUserLoginId = currentUser?.userLoginId;
            let targetUserId = currentUser?.userId;

            if (currentUser && currentUser.userId) {
                targetUserLoginId = currentUser.userLoginId;
                targetUserId = currentUser.userId;
            } else {
                setError("사용자 정보를 불러올 수 없습니다.");
                setIsLoading(false);
                return;
            }

            try {
                const userProfileResponse = await axios.get(`http://192.168.0.10:8080/api/user/profile/loginid/${targetUserLoginId}`);
                if (userProfileResponse.data.status === "success") {
                    setUserData(userProfileResponse.data.userProfile);
                    targetUserId = userProfileResponse.data.userProfile.userId;
                } else {
                    console.error("사용자 프로필을 가져오는 데 실패했습니다:", userProfileResponse.data.message);
                    setUserData(null);
                    setError(userProfileResponse.data.message || "사용자 프로필을 불러오는 데 실패했습니다.");
                    setIsLoading(false);
                    return;
                }
            } catch (error) {
                console.error("사용자 프로필 조회 중 오류 발생:", error);
                setUserData(null);
                setError("사용자 프로필을 불러오는 중 오류가 발생했습니다.");
                setIsLoading(false);
                return;
            }

            if (targetUserId) {
                try {
                    const followerCountResponse = await axios.get(`http://192.168.0.10:8080/api/follows/followers/count/${targetUserId}`);
                    if (followerCountResponse.status === 200) {
                        setFollowerCount(followerCountResponse.data.followerCount);
                    } else {
                        console.error("팔로워 수를 가져오는 데 실패했습니다.");
                    }
                } catch (error) {
                    console.error("팔로워 수 조회 중 오류 발생:", error);
                }

                try {
                    const followingCountResponse = await axios.get(`http://192.168.0.10:8080/api/follows/followings/count/${targetUserId}`);
                    if (followingCountResponse.status === 200) {
                        setFollowingCount(followingCountResponse.data.followingCount);
                    } else {
                        console.error("팔로잉 수를 가져오는 데 실패했습니다.");
                    }
                } catch (error) {
                    console.error("팔로잉 수 조회 중 오류 발생:", error);
                }
            }
            setIsLoading(false);
        };

        fetchUserDataAndFollowCounts();
    }, [currentUser]);

    if (isLoading) {
        return <p>사용자 정보를 불러오는 중입니다...</p>;
    }

    if (error) {
        return <p className="error-message">{error}</p>;
    }

    if (!userData) {
        return <p>사용자 정보를 불러올 수 없습니다.</p>;
    }

    return (
        <div className="user-info-section">
            <div className="profile-image-container">
                <img
                    src={userData.userProfileImageUrl || "https://via.placeholder.com/150"
                    }
                    alt="프로필 이미지"
                    className="profile-image" />
            </div>
            <div className="user-details">
                <p>
                    <strong>아이디:</strong>
                    {userData.userLoginId}
                </p>
                <p>
                    <strong>닉네임:</strong>
                    {userData.userNickname}
                </p>
                <p>
                    <strong>이메일:</strong>
                    {userData.userEmail}
                </p>
                <p>
                    <strong>이름:</strong>
                    {userData.userName}
                </p>
                <p>
                    <strong>소개:</strong>
                    <textarea
                        type="text"
                        className="UserInfo-bio"
                        value={userData.userBio || "작성된 소개가 없습니다."}
                        readOnly
                    />
                </p>
                <p>
                    <strong>가입일:</strong>
                    {new Date(userData.createDate).toLocaleDateString()}
                </p>
                <p>
                    <strong>팔로워:</strong> {followerCount}
                </p>
                <p>
                    <strong>팔로잉:</strong> {followingCount}
                </p>
            </div>
        </div>
    );
}

export default UserInfo;