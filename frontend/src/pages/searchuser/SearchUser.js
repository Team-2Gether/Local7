import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../assets/css/SearchUser.css'; // Add CSS import

function SearchUser() {
    const [keyword, setKeyword] = useState('');
    const [users, setUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(0); // Backend's pageNumber is 0-indexed
    const [pageSize, setPageSize] = useState(10);
    const [totalPages, setTotalPages] = useState(0);
    const [totalElements, setTotalElements] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    // 검색 기준을 위한 상태 추가 (기본값을 'all' 또는 특정 필드로 설정)
    const [searchField, setSearchField] = useState('all'); // 'all', 'userLoginId', 'userName', 'userNickname', 'userEmail'

    const navigate = useNavigate();

    // fetchUsers 함수를 useCallback으로 래핑하여 불필요한 재생성을 방지합니다.
    const fetchUsers = useCallback(async (searchKeyword, searchPage, searchSearchField) => { // 인자로 받도록 수정
        setLoading(true);
        setError(null);
        try {
            const params = {
                keyword: searchKeyword, // 인자로 받은 키워드 사용
                page: searchPage,     // 인자로 받은 페이지 사용
                pageSize: pageSize,
                searchField: searchSearchField // 인자로 받은 검색 필드 사용
            };

            const response = await axios.get(`http://localhost:8080/api/search/users`, {
                params: params
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
    }, [pageSize]); // pageSize만 의존성으로 유지, 나머지는 인자로 받음

    // 컴포넌트 마운트 시 초기 검색 (선택사항: 필요 없으면 이 useEffect는 제거 가능)
    // 현재는 페이지 로드 시에도 한 번 검색이 실행되도록 유지합니다.
    useEffect(() => {
        // 초기 로드 시 'all' 검색 기준으로 빈 키워드로 검색
        fetchUsers(keyword, currentPage, searchField);
    }, []); // 빈 배열을 두어 마운트 시 한 번만 실행되도록 함

    const handleSearch = (e) => {
        e.preventDefault(); // 폼 기본 제출 동작 방지
        setCurrentPage(0); // 새 검색 시 첫 페이지로 리셋
        // 현재 상태의 keyword와 searchField를 사용하여 fetchUsers 호출
        fetchUsers(keyword, 0, searchField); // 검색 버튼 클릭 시에만 검색 실행
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setCurrentPage(newPage);
            // 페이지 변경 시에도 현재 검색 키워드와 필드를 유지하여 fetchUsers 호출
            fetchUsers(keyword, newPage, searchField);
        }
    };

    const handleUserClick = (userLoginId) => {
        navigate(`/user/profile/${userLoginId}`);
    };

    // 셀렉트 박스 변경 핸들러
    const handleSelectChange = (e) => {
        setSearchField(e.target.value);
        // 셀렉트 박스 변경 시 자동 검색이 아닌, '검색' 버튼을 눌러야 검색되도록 하려면
        // 여기서 fetchUsers를 호출하지 않습니다.
    };


    return (
        <div className="search-user-container1">
            <h2>유저 검색</h2>
            <form onSubmit={handleSearch} className="search-form1">
                <div className="search-criteria-select1">
                    <label htmlFor="searchField">검색 기준:</label>
                    <select
                        id="searchField"
                        name="searchField"
                        value={searchField}
                        onChange={handleSelectChange}
                        className="search-select1"
                    >
                        <option value="all">전체</option>
                        <option value="userLoginId">아이디</option>
                        <option value="userName">이름</option>
                        <option value="userNickname">닉네임</option>
                        <option value="userEmail">이메일</option>
                    </select>               
                <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="search-input1"
                />
                <button type="submit" className="search-button1">검색</button>
                </div>
                
            </form>

            {loading && <p>사용자 정보를 불러오는 중입니다...</p>}
            {error && <p className="error-message1">{error}</p>}

            {!loading && !error && users.length === 0 && (
                (keyword !== '' || searchField !== 'all') ? <p>검색 결과가 없습니다.</p> : <p>사용자를 검색해주세요.</p>
            )}

            {!loading && !error && users.length > 0 && (
                <div className="user-list1">
                    {users.map(user => (
                        <div key={user.userId} className="user-item1" onClick={() => handleUserClick(user.userLoginId)}>
                            <img
                                src={user.userProfileImageUrl || "https://via.placeholder.com/50"}
                                alt="프로필"
                                className="profile-image1"
                            />
                            <div className="user-details1">
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
                <div className="pagination-controls1">
                    <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 0}
                        className="pagination-button1"
                    >
                        이전
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                        <button
                            key={i}
                            onClick={() => handlePageChange(i)}
                            className={`pagination-button1 ${currentPage === i ? 'active1' : ''}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                    <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages - 1}
                        className="pagination-button1"
                    >
                        다음
                    </button>
                </div>
            )}
        </div>
    );
}

export default SearchUser;