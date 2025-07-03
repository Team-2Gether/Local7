// react-frontend/src/components/BoardList.js (예시: 게시판 목록에 페이지네이션 적용)

import React, { useState, useEffect } from 'react';
import axios from 'axios'; // npm install axios 필요
import PaginationComponent from './PaginationComponent';

const BoardList = () => {
  const [items, setItems] = useState([]); // 데이터를 담을 상태 (예: 게시물 목록)
  const [totalItems, setTotalItems] = useState(0); // 총 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 (UI에서는 1부터 시작)
  const [itemsPerPage, setItemsPerPage] = useState(10); // 페이지당 아이템 수
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 검색 기능 추가를 위한 상태
  const [searchKeyword, setSearchKeyword] = useState('');
  const [searchType, setSearchType] = useState('name'); // 'name', 'description' 등

  // 데이터를 가져오는 함수
  const fetchPagedItems = async (page, size, keyword, type) => {
    setLoading(true);
    setError(null);
    try {
      // Spring Boot 백엔드의 PagenationController 엔드포인트 호출
      // 백엔드는 페이지를 0부터 시작하는 경우가 많으므로, page - 1로 보냅니다.
      const response = await axios.get(`/api/pagenation`, {
        params: {
          page: page - 1, // 백엔드는 보통 0-indexed 페이지 사용 [cite: 2]
          size: size,
          searchKeyword: keyword,
          searchType: type
        }
      });
      // 응답 구조는 Spring Page 객체와 유사할 것으로 예상 [cite: 5]
      // content: 현재 페이지의 데이터 배열
      // totalElements: 전체 아이템 수
      // totalPages: 전체 페이지 수
      setItems(response.data.content); // [cite: 5]
      setTotalItems(response.data.totalElements); // [cite: 5]
      // totalPages는 직접 계산하거나 백엔드에서 받아와도 됩니다.
      // const backendTotalPages = response.data.totalPages;
    } catch (err) {
      console.error('Error fetching paged items:', err);
      setError('Failed to load data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  // 페이지, itemsPerPage, 검색 조건 변경 시 데이터 다시 로드
  useEffect(() => {
    fetchPagedItems(currentPage, itemsPerPage, searchKeyword, searchType);
  }, [currentPage, itemsPerPage, searchKeyword, searchType]); // 의존성 배열에 모든 상태 포함

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // 페이지당 아이템 수 변경 핸들러
  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
    setCurrentPage(1); // 페이지당 아이템 수가 변경되면 첫 페이지로 이동
  };

  // 검색 제출 핸들러
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setCurrentPage(1); // 검색 시 첫 페이지로 이동
    // useEffect가 searchKeyword와 searchType 변경을 감지하여 데이터를 다시 가져옵니다.
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  // 총 페이지 수 계산
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <div>
      <h1>Paged Items List</h1>

      {/* 검색 폼 */}
      <form onSubmit={handleSearchSubmit}>
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="name">Name</option>
          <option value="description">Description</option>
        </select>
        <input
          type="text"
          placeholder="Search keyword"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button type="submit">Search</button>
      </form>

      {/* 페이지당 아이템 수 선택 */}
      <div>
        Items per page:
        <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      {/* 데이터 목록 표시 */}
      {items.length > 0 ? (
        <ul>
          {items.map((item) => (
            // PagenationVO<?>의 content 필드가 어떤 객체를 담고 있는지에 따라 접근 방식이 달라집니다.
            // 여기서는 예시로 item.id, item.name 등을 사용했습니다.
            // 실제 백엔드에서 반환하는 VO 필드에 맞게 수정해주세요.
            <li key={item.id}>
              <strong>ID:</strong> {item.id}, <strong>Name:</strong> {item.name}, <strong>Description:</strong> {item.description}
            </li>
          ))}
        </ul>
      ) : (
        <p>No items found.</p>
      )}

      {/* 페이지네이션 컴포넌트 렌더링 */}
      {totalPages > 0 && (
        <PaginationComponent
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}

      <style jsx>{`
        /* 기본적인 CSS 스타일 (선택 사항) */
        .pagination ul {
          list-style: none;
          padding: 0;
          display: flex;
          justify-content: center;
          margin-top: 20px;
        }
        .pagination li {
          margin: 0 5px;
        }
        .pagination button {
          padding: 8px 12px;
          border: 1px solid #ddd;
          background-color: #f8f8f8;
          cursor: pointer;
          border-radius: 4px;
        }
        .pagination button:hover:not(:disabled) {
          background-color: #e0e0e0;
        }
        .pagination li.active button {
          background-color: #007bff;
          color: white;
          border-color: #007bff;
        }
        .pagination li.disabled button {
          cursor: not-allowed;
          opacity: 0.6;
        }
      `}</style>
    </div>
  );
};

export default BoardList;