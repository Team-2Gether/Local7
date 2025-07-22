import React from 'react';

const ReviewList = ({ reviews, searchTerm, setSearchTerm, handleDeleteReview }) => {
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
                    {
                        reviews.map(review => (
                            <tr key={review.reviewId}>
                                <td>{review.reviewId}</td>
                                <td>{review.reviewContent}</td>
                                <td>{review.userNickname}</td>
                                <td>{review.reviewRating}</td>
                                <td>{new Date(review.createdDate).toLocaleDateString()}</td>
                                <td>
                                    <button
                                        onClick={() => handleDeleteReview(review.reviewId)}
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

export default ReviewList;
