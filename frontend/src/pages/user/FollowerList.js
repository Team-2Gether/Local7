import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import '../../assets/css/follow.css'; // 통합 CSS 파일 import

function FollowerList({ currentUser }) {
    const { userId: urlUserId } = useParams();
    const [followers, setFollowers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [targetUserId, setTargetUserId] = useState(null);

    useEffect(() => {
        const fetchFollowers = async () => {
            setLoading(true);
            setError(null);

            let idToFetch = null;

            if (urlUserId) {
                idToFetch = parseInt(urlUserId);
            }
            else if (currentUser && currentUser.userId) {
                idToFetch = currentUser.userId;
            }

            if (!idToFetch) {
                setError("사용자 ID를 찾을 수 없습니다.");
                setLoading(false);
                return;
            }

            setTargetUserId(idToFetch);

            try {
                const response = await axios.get(`http://192.168.0.10:8080/api/follows/followers/${idToFetch}`);
                if (response.status === 200) {
                    setFollowers(response.data);
                } else {
                    setError("팔로워 목록을 불러오는 데 실패했습니다.");
                }
            } catch (err) {
                console.error("팔로워 목록 조회 중 오류 발생:", err);
                setError("팔로워 목록을 불러오는 중 오류가 발생했습니다.");
            } finally {
                setLoading(false);
            }
        };

        fetchFollowers();
    }, [urlUserId, currentUser]);

    if (loading) {
        return <div className="follow-list-container loading">로딩 중...</div>;
    }

    if (error) {
        return <div className="follow-list-container error-message">{error}</div>;
    }

        return (
        <div className="follow-list-container">
            <h2 className="follow-list-title">
                {targetUserId === currentUser?.userId ? "내 팔로워 목록" : "팔로워 목록"}
            </h2>
            {followers.length === 0 ? (
                <p className="follow-no-list-message">팔로워가 없습니다.</p>
            ) : (
                <ul className="follow-items">
                    {followers.map((follow) => (
                        <li key={follow.followerId} className="follow-item">
                            <Link to={`/user/profile/${follow.followerUserLoginId}`} className="follow-link">
                                <img
                                    src={follow.followerUserProfileImageUrl || "https://via.placeholder.com/50"}
                                    alt="프로필"
                                    className="follow-profile-image"
                                />
                                <div className="follow-details">
                                    <p className="follow-nickname">{follow.followerUserNickname}</p>
                                    <p className="follow-id">@{follow.followerUserLoginId}</p>
                                </div>
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default FollowerList;