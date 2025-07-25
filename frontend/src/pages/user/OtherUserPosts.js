// src/pages/user/OtherUserPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../assets/css/OtherUserPosts.css';
import { Link } from 'react-router-dom';

function OtherUserPosts({ userId }) {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(10);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10;

    const sanitizeText = (text) => {
        if (!text) return '';
        return text
            .replace(/[\u0000-\u001F\u007F-\u009F]/g, "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    };

    useEffect(() => {
        if (userId) {
            fetchUserPosts(page);
        } else {
            setLoading(false);
        }
    }, [page, userId]);

    const fetchUserPosts = async (currentPage) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://192.168.0.10:8080/api/user/${userId}/posts`, {
                params: {
                    page: currentPage,
                    size: pageSize
                },
                withCredentials: true
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
        if (newPage >= 0 && newPage < totalPages) {
            setPage(newPage);
        }
    };

    if (loading) {
        return <div className="other-user-posts-section1 loading1">게시글을 불러오는 중...</div>;
    }

    if (error) {
        return <div className="other-user-posts-section1 error-message1">오류: {error}</div>;
    }

    if (!posts || posts.length === 0) {
        return <div className="other-user-posts-section1 no-posts1">작성된 게시글이 없습니다.</div>;
    }

    return (
        <div className="other-user-posts-section1">
            <h3 className="section-title1">작성한 게시글</h3>
            <div className="post-list1">
                {posts.map(post => (
                    <div key={post.postId} className="post-item1">
                        <Link to={`/posts/${post.postId}`} className="post-link1">
                            <h4 className="post-title1">{sanitizeText(post.postTitle)}</h4>
                            <p className="post-content1">{sanitizeText(post.postContent)}</p>
                            <p className="post-meta1">작성자: {post.userLoginId} | 작성일: {new Date(post.createdDate).toLocaleDateString()}</p>
                            {post.images && post.images.length > 0 && (
                                <div className="post-images1">
                                    {post.images.map((image, index) => (
                                        <img
                                            key={index}
                                            src={image.imageUrl}
                                            alt={`Post ${post.postId} Image ${index}`}
                                            className="post-image-thumbnail1"
                                        />
                                    ))}
                                </div>
                            )}
                            <p className="post-comments1">댓글 수: {post.commentCount}</p>
                        </Link>
                    </div>
                ))}
            </div>
            {totalPages > 1 && (
                <div className="pagination-controls1">
                    <button
                        onClick={() => handlePageChange(page - 1)}
                        disabled={page === 0}
                        className="pagination-button1"
                    >
                        이전
                    </button>
                    <span className="page-info1">
                        {page + 1} / {totalPages} (총 {totalElements}개)
                    </span>
                    <button
                        onClick={() => handlePageChange(page + 1)}
                        disabled={page === totalPages - 1}
                        className="pagination-button1"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default OtherUserPosts;
