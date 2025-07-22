import React from 'react';

const UserList = ({ users, searchTerm, setSearchTerm, handleDeleteUser, handleRowClick, currentPage, totalPages, handlePageChange }) => {
    
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
                    {/* users가 배열인지 확인 후 map 호출 */}
                    {Array.isArray(users) && users.map(user => (
                        <tr key={user.userId}>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userId}</td>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userLoginId}</td>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userNickname}</td>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{user.userEmail}</td>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>{new Date(user.createDate).toLocaleDateString()}</td>
                            <td onClick={() => handleRowClick(user.userLoginId, "user")}>
                                {
                                    user.ruleId === 1
                                        ? "관리자"
                                        : "일반"
                                }
                            </td>
                            <td>
                                <button
                                    onClick={() => handleDeleteUser(user.userId, user.userNickname)}
                                    className="admin-action-button delete">삭제</button>
                            </td>
                        </tr>
                    ))}
                    {/* users가 비어있을 경우 메시지 표시 */}
                    {Array.isArray(users) && users.length === 0 && !searchTerm && (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                        </tr>
                    )}
                     {Array.isArray(users) && users.length === 0 && searchTerm && (
                        <tr>
                            <td colSpan="7" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {/* totalPages가 1보다 클 때만 페이지네이션 컨트롤 표시 */}
            {totalPages > 1 && <PaginationControls />}
        </div>
    );
};

export default UserList;
