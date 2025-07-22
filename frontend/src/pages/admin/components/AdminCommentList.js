import React from 'react';

const CommentList = ({ comments, searchTerm, setSearchTerm, handleDeleteComment, handleRowClick }) => {
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
                    {
                        comments.map(comment => (
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
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default CommentList;
