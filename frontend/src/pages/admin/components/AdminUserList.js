import React from 'react';

const UserList = ({ users, searchTerm, setSearchTerm, handleDeleteUser, handleRowClick }) => {
    return (
        <div>
            <div className="search-bar-container">
                <input
                    type="text"
                    placeholder="사용자 ID, 로그인 ID, 닉네임, 이메일 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <h3>사용자 목록</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>로그인 ID</th>
                        <th>닉네임</th>
                        <th>이메일</th>
                        <th>가입일</th>
                        <th>권한</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        users.map(user => (
                            <tr key={user.userId}>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userId}</td>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userLoginId}</td>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userNickname}</td>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userEmail}</td>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{new Date(user.createDate).toLocaleDateString()}</td>
                                <td onClick={() => handleRowClick(user.userLoginId, "user")}>{
                                    user.ruleId === 1
                                        ? "관리자"
                                        : "일반"
                                }
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteUser(user.userId)}
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

export default UserList;
