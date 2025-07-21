import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SearchUser() {
    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Backend's pageNumber is 0-indexed
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(`http://localhost:8080/api/search/users`, {
                params: {
                    keyword: keyword,
                    page: currentPage,
                    pageSize: pageSize
                }
            });
            const data = response.data;
            if (response.status === 200) {
                setUsers(data.content);
                setTotalPages(data.totalPages);
                setTotalElements(data.totalElements);
            } else if (response.status === 204) { // No Content
                setUsers([]);
                setTotalPages(0);
                setTotalElements(0);
            }
        } catch (err) {
            console.error("Failed to fetch users:", err);
            setError("사용자를 불러오는 데 실패했습니다. 다시 시도해주세요.");
            setUsers([]);
            setTotalPages(0);
            setTotalElements(0);
        } finally {
            setLoading(false);
        }
    }, [keyword, currentPage, pageSize]); // Add currentPage and pageSize to dependencies

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset to first page on new search
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleUserClick = (userLoginId) => {
        navigate(`/user/profile/${userLoginId}`);
    };

    return (
        <div className="search-user-container">
            <h2>유저 검색</h2>
            <form onSubmit={handleSearch} className="search-form">
                <input
                    type="text"
                    placeholder="아이디, 이름, 닉네임, 이메일로 검색"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="search-input"
                />
                <button type="submit" className="search-button">검색</button>
            </form>

            {loading && <p>사용자 정보를 불러오는 중입니다...</p>}
            {error && <p className="error-message">{error}</p>}

            {!loading && !error && users.length === 0 && keyword && <p>검색 결과가 없습니다.</p>}
            {!loading && !error && users.length === 0 && !keyword && <p>사용자를 검색해주세요.</p>}


            {!loading && !error && users.length > 0 && (
                <div className="user-list">
                    {users.map(user => (
                        <div key={user.userId} className="user-item" onClick={() => handleUserClick(user.userLoginId)}>
                            <img 
                                src={user.userProfileImageUrl || "https://via.placeholder.com/50"} 
                                alt="프로필" 
                                className="profile-image"
                            />
                            <div className="user-details">
                                <p><strong>아이디:</strong> {user.userLoginId}</p>
                                <p><strong>닉네임:</strong> {user.userNickname}</p>
                                <p><strong>이름:</strong> {user.userName}</p>
                                <p><strong>이메일:</strong> {user.userEmail}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!loading && !error && totalPages > 1 && (
                <div className="pagination-controls">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)} 
                        disabled={currentPage === 0}
                        className="pagination-button"
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button 
                            key={i} 
                            onClick={() => handlePageChange(i)} 
                            className={`pagination-button ${currentPage === i ? 'active' : ''}`}
                        >
                            {i + 1}
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
            )}
        </div>
    );
}

export default SearchUser;