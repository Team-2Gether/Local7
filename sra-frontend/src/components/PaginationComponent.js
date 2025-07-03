// react-frontend/src/components/PaginationComponent.js

import React from 'react';

const PaginationComponent = ({
  currentPage,    // 현재 페이지 (1부터 시작)
  totalPages,     // 총 페이지 수
  onPageChange    // 페이지 변경 시 호출될 콜백 함수
}) => {
  const pageNumbers = [];
  const maxPageNumbersToShow = 5; // 화면에 보여줄 최대 페이지 번호 개수

  // 현재 페이지를 중심으로 페이지 번호 범위 계산
  let startPage = Math.max(1, currentPage - Math.floor(maxPageNumbersToShow / 2));
  let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

  // 만약 계산된 페이지 범위가 maxPageNumbersToShow보다 작으면, 시작 페이지를 조정하여 개수를 맞춤
  if (endPage - startPage + 1 < maxPageNumbersToShow) {
    startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
  }

  // 페이지 번호 생성
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(
      <li key={i} className={currentPage === i ? 'active' : ''}>
        <button onClick={() => onPageChange(i)}>{i}</button>
      </li>
    );
  }

  return (
    <nav className="pagination">
      <ul>
        {/* 처음 페이지 버튼 */}
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <button onClick={() => onPageChange(1)} disabled={currentPage === 1}>
            &laquo; First
          </button>
        </li>
        {/* 이전 페이지 버튼 */}
        <li className={currentPage === 1 ? 'disabled' : ''}>
          <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
            &lsaquo; Previous
          </button>
        </li>

        {/* 페이지 번호들 */}
        {pageNumbers}

        {/* 다음 페이지 버튼 */}
        <li className={currentPage === totalPages ? 'disabled' : ''}>
          <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
            Next &rsaquo;
          </button>
        </li>
        {/* 마지막 페이지 버튼 */}
        <li className={currentPage === totalPages ? 'disabled' : ''}>
          <button onClick={() => onPageChange(totalPages)} disabled={currentPage === totalPages}>
            Last &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default PaginationComponent;