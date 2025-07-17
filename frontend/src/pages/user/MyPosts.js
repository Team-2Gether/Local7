// src/components/MyPosts.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './MyPosts.css'; // 새로운 CSS 파일 import

function MyPosts({ currentUser }) { // currentUser prop 추가
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const pageSize = 10; // 한 페이지에 보여줄 게시글 수

    // userId를 currentUser prop에서 가져옵니다.
    const userId = currentUser?.userId; // currentUser가 null일 수 있으므로 옵셔널 체이닝 사용

    useEffect(() => {
        if (userId) { // userId가 있을 때만 게시글을 불러오도록 조건 추가
            fetchUserPosts(page);
        } else {
            setLoading(false);
            setError("사용자 ID를 불러올 수 없습니다. 로그인 상태를 확인해주세요.");
        }
    }, [page, userId]); // userId 변경 시에도 게시글 다시 불러오기

    const fetchUserPosts = async (currentPage) => {
        setLoading(true);
        setError(null);
        try {
            // URL에 userId를 포함하도록 수정
            const response = await axios.get(`http://localhost:8080/api/user/${userId}/posts`, {
                params: {
                    page: currentPage,
                    size: pageSize
                },
                withCredentials: true // 세션 쿠키를 포함하여 요청
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

    if (error) {
        return <div className="my-posts-container error-message">{error}</div>;
    }

    return (
        <div className="my-posts-container">
            <h2 className="my-posts-title">내가 작성한 게시글</h2>
            {loading ? (
                <p>게시글을 불러오는 중...</p>
            ) : posts.length === 0 ? (
                <p className="no-posts-message">작성된 게시글이 없습니다.</p>
            ) : (
                <>
                    <ul className="post-list1">
                        {posts.map((post) => (
                            <li key={post.postId} className="post-item">
                                <Link to={`/posts/${post.postId}`} className="post-link">
                                    <h3 className="post-item-title">{post.postTitle}</h3>
                                    <p className="post-item-date">{new Date(post.createdDate).toLocaleDateString()}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
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
                </>
            )}
        </div>
    );
}

export default MyPosts;