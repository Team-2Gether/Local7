import React from 'react';

const ReviewList = ({ reviews, searchTerm, setSearchTerm, handleDeleteReview, currentPage, totalPages, handlePageChange, handleRowClick}) => {
    
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
                    placeholder="리뷰 내용, 작성자 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <h3>리뷰 목록</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>내용</th>
                        <th>작성자</th>
                        <th>별점</th>
                        <th>작성일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {/* reviews가 배열인지 확인 후 map 호출 */}
                    {Array.isArray(reviews) && reviews.map(review => (
                        <tr key={review.reviewId}>
                            <td onClick={() => handleRowClick(review.reviewId, "review", review.restaurantId)}>{review.reviewId}</td>
                            <td onClick={() => handleRowClick(review.reviewId, "review", review.restaurantId)}>{review.reviewContent}</td>
                            <td onClick={() => handleRowClick(review.reviewId, "review", review.restaurantId)}>
                              {review.userNickname === "Google_User" ? review.createdId : review.userNickname}
                            </td>
                            <td onClick={() => handleRowClick(review.reviewId, "review", review.restaurantId)}>{review.reviewRating}</td>
                            <td onClick={() => handleRowClick(review.reviewId, "review", review.restaurantId)}>{new Date(review.createdDate).toLocaleDateString()}</td>
                            <td>
                                <button
                                    onClick={() => handleDeleteReview(review.reviewId)}
                                    className="admin-action-button delete">삭제</button>
                            </td>
                        </tr>
                    ))}
                    {/* reviews가 비어있을 경우 메시지 표시 */}
                    {Array.isArray(reviews) && reviews.length === 0 && !searchTerm && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                        </tr>
                    )}
                     {Array.isArray(reviews) && reviews.length === 0 && searchTerm && (
                        <tr>
                            <td colSpan="6" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {totalPages > 1 && <PaginationControls />}
        </div>
    
    );
};

export default ReviewList;
