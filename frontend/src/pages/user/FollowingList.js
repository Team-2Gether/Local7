import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function FollowingList({ currentUser }) {
    const { userId: urlUserId } = useParams(); // URL 파라미터에서 userId를 가져옵니다.
    const [followings, setFollowings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [targetUserId, setTargetUserId] = useState(null); // 실제 API 호출에 사용될 userId

    useEffect(() => {
        const fetchFollowings = async () => {
            setLoading(true);
            setError(null);

            let idToFetch = null;

            // 1. URL 파라미터에 userId가 있다면 그 값을 사용 (OtherUser 페이지에서 접근 시)
            if (urlUserId) {
                idToFetch = parseInt(urlUserId);
            }
            // 2. MyPage에서 접근 시 currentUser의 userId를 사용
            else if (currentUser && currentUser.userId) {
                idToFetch = currentUser.userId;
            }

            if (!idToFetch) {
                setError("사용자 ID를 찾을 수 없습니다.");
                setLoading(false);
                return;
            }

            setTargetUserId(idToFetch); // API 호출에 사용할 최종 userId 설정

            try {
                const response = await axios.get(`http://localhost:8080/api/follows/followings/${idToFetch}`);
                if (response.status === 200) {
                    setFollowings(response.data);
                } else {
                    setError("팔로잉 목록을 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("팔로잉 목록 조회 중 오류 발생:", err);
                setError("팔로잉 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowings();
    }, [urlUserId, currentUser]); // currentUser 또는 URL userId 변경 시 재호출

    if (loading) {
        return <div className="follow-list-container">로딩 중...</div>;
    }

    if (error) {
        return <div className="follow-list-container error-message">{error}</div>;
    }

    return (
        <div className="follow-list-container">
            <h2 className="follow-list-title">
                {targetUserId === currentUser?.userId ? "내가 팔로우하는 목록" : "팔로잉 목록"}
            </h2>
            {followings.length === 0 ? (
                <p className="no-followings-message">팔로우하는 사람이 없습니다.</p>
            ) : (
                <ul className="follow-items">
                    {followings.map((follow) => (
                        <li key={follow.followingId} className="follow-item">
                            <img
                                src={follow.followingUserProfileImageUrl || "https://via.placeholder.com/50"}
                                alt="프로필"
                                className="follow-profile-image"
                            />
                            <div className="follow-details">
                                <p className="follow-nickname">{follow.followingUserNickname}</p>
                                <p className="follow-id">@{follow.followingUserLoginId}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FollowingList;