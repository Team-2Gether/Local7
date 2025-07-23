import React from 'react';

const PostList = ({ posts, searchTerm, setSearchTerm, handleDeletePost, handleRowClick, currentPage, totalPages, handlePageChange, }) => {

    const PaginationControls = () => {
        const pageNumbers = [];
        // totalPages가 유효한 숫자인지 확인
        for (let i = 0; i < totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="pagination-controls">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="pagination-button"
                >
                    이전
                </button>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        onClick={() => handlePageChange(number)}
                        className={`pagination-button ${currentPage === number ? 'active' : ''}`}
                    >
                        {number + 1}
                    </button>
                ))}
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="pagination-button"
                >
                    다음
                </button>
            </div>
        );
    };

    return (
        <div>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="게시글 제목, 작성자 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <h3>게시글 목록</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {/* posts가 배열인지 확인 후 map 호출 */}
                    {Array.isArray(posts) && posts.map(post => (
                        <tr key={post.postId}>
                            <td onClick={() => handleRowClick(post.postId, "post")}>{post.postId}</td>
                            <td onClick={() => handleRowClick(post.postId, "post")}>{post.postTitle}</td>
                            <td onClick={() => handleRowClick(post.postId, "post")}>
                                {post.userNickname === "Google_User" ? post.createdId : post.userNickname}
                            </td>
                            <td onClick={() => handleRowClick(post.postId, "post")}>{new Date(post.createdDate).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDeletePost(post.postId)}
                                    className="admin-action-button delete">삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    {/* posts가 비어있을 경우 메시지 표시 */}
                    {Array.isArray(posts) && posts.length === 0 && !searchTerm && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                        </tr>
                    )}
                     {Array.isArray(posts) && posts.length === 0 && searchTerm && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {totalPages > 1 && <PaginationControls />}

        </div>
    );
};

export default PostList;
