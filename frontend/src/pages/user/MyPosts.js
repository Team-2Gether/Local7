// src/components/MyPosts.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useMyPosts } from './hook/useMyPosts'; // 분리된 훅 import
import '../../assets/css/MyPosts.css'; // 기존 CSS 파일 import

function MyPosts({ currentUser }) {
    const pageSize = 10;
    const userId = currentUser?.userId;

    const {
        posts,
        loading,
        error,
        page,
        totalPages,
        totalElements,
        handlePageChange
    } = useMyPosts(userId, pageSize);

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