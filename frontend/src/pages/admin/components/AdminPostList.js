import React from 'react';

const PostList = ({ posts, searchTerm, setSearchTerm, handleDeletePost, handleRowClick }) => {
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
                    {
                        posts.map(post => (
                            <tr key={post.postId}>
                                <td onClick={() => handleRowClick(post.postId, "post")}>{post.postId}</td>
                                <td onClick={() => handleRowClick(post.postId, "post")}>{post.postTitle}</td>
                                <td onClick={() => handleRowClick(post.postId, "post")}>{post.userNickname}</td>
                                <td onClick={() => handleRowClick(post.postId, "post")}>{new Date(post.createdDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeletePost(post.postId)}
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

export default PostList;
