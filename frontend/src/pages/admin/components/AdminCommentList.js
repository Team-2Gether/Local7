import React from 'react';

const CommentList = ({ comments, searchTerm, setSearchTerm, handleDeleteComment, handleRowClick, currentPage, totalPages, handlePageChange }) => {
    
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
                    placeholder="댓글 내용, 작성자 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <h3>댓글 목록</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>작성일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {/* comments가 배열인지 확인 후 map 호출 */}
                    {Array.isArray(comments) && comments.map(comment => (
                        <tr key={comment.commentId}>
                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.commentId}</td>
                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.content}</td>
                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{comment.userNickname}</td>
                            <td onClick={() => handleRowClick(comment.postId, "comment")}>{new Date(comment.createdDate).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteComment(comment.commentId)}
                                    className="admin-action-button delete">삭제</button>
                            </td>
                        </tr>
                    ))}
                    {/* comments가 비어있을 경우 메시지 표시 */}
                    {Array.isArray(comments) && comments.length === 0 && !searchTerm && (
                        <tr>
                            <td colSpan="5" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                        </tr>
                    )}
                    {Array.isArray(comments) && comments.length === 0 && searchTerm && (
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

export default CommentList;
