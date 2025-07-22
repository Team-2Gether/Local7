// src/pages/user/OtherUserPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/OtherUserPosts.css';
import { Link } from 'react-router-dom'; // Link 컴포넌트 추가

function OtherUserPosts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0); // 페이지 상태를 0부터 시작하도록 변경 (스프링 부트 페이징 0-index)
    const [totalPages, setTotalPages] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10; // 한 페이지에 보여줄 게시글 수

    // 안전하게 텍스트를 렌더링하기 위한 헬퍼 함수
    const sanitizeText = (text) => {
        if (!text) return '';
        return text.replace(/[\u0000-\u001F\u007F-\u009F]/g, "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    };

    useEffect(() => {
        if (userId) { // userId가 있을 때만 게시글을 불러오도록 조건 추가
            fetchUserPosts(page);
        } else {
            setLoading(false);
            // setError("사용자 ID를 불러올 수 없습니다."); // OtherUserPosts에서는 userId가 항상 전달되므로 이 에러 메시지는 필요 없을 가능성이 높습니다.
        }
    }, [page, userId]); // page 또는 userId 변경 시 재실행

    const fetchUserPosts = async (currentPage) => {
        setLoading(true);
        setError(null);
        try {
            // URL에 userId를 포함하도록 수정
            const response = await axios.get(`http://localhost:8080/api/user/${userId}/posts`, {
                params: {
                    page: currentPage, // 0-indexed 페이지 번호 전달
                    size: pageSize
                },
                withCredentials: true // 세션 쿠키를 포함하여 요청 (필요에 따라)
            });
            if (response.data.status === "success") {
                const paginationData = response.data.pagination;
                setPosts(paginationData.content);
                setTotalPages(paginationData.totalPages);
                setTotalElements(paginationData.totalElements);
            } else {
                setError(response.data.message || "게시글을 불러오는 데 실패했습니다.");
            }
        } catch (err) {
            console.error("Error fetching user posts:", err);
            setError("게시글을 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) { // 0부터 totalPages - 1까지 유효
            setPage(newPage);
        }
    };

    if (loading) {
        return <div className="other-user-posts-section loading">게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="other-user-posts-section error-message">오류: {error}</div>;
    }

    if (!posts || posts.length === 0) {
        return <div className="other-user-posts-section no-posts">작성된 게시글이 없습니다.</div>;
    }

    return (
        <div className="other-user-posts-section">
            <h3 className="section-title">작성한 게시글</h3>
            <div className="post-list1">
                {posts.map(post => (
                    <div key={post.postId} className="post-item">
                        {/* 게시글 상세 페이지로 이동하는 Link 추가 */}
                        <Link to={`/posts/${post.postId}`} className="post-link">
                            <h4 className="post-title">{sanitizeText(post.postTitle)}</h4>
                            <p className="post-content">{sanitizeText(post.postContent)}</p>
                            <p className="post-meta">작성자: {post.userLoginId} | 작성일: {new Date(post.createdDate).toLocaleDateString()}</p>
                            {post.images && post.images.length > 0 && (
                                <div className="post-images">
                                    {post.images.map((image, index) => (
                                        <img key={index} src={image.imageUrl} alt={`Post ${post.postId} Image ${index}`} className="post-image-thumbnail" />
                                    ))}
                                </div>
                            )}
                            <p className="post-comments">댓글 수: {post.commentCount}</p>
                        </Link>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="pagination-button"
                    >
                        이전
                    </button>
                    <span className="page-info">
                        {page + 1} / {totalPages} (총 {totalElements}개)
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                        className="pagination-button"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default OtherUserPosts;