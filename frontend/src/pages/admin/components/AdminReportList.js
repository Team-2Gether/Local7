import React from 'react';

const ReportList = ({ reports, searchTerm, setSearchTerm, handleDeleteUser, currentPage, totalPages, handlePageChange, handleRowClick  }) => {

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
                    placeholder="신고 대상, 사유 검색"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="admin-search-input"
                />
            </div>
            <h3>신고 목록</h3>
            <table className="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>신고 유형</th>
                        <th>신고한 사람</th>
                        <th>신고 대상</th>
                        <th>신고 대상 내용</th>
                        <th>사유</th>
                        <th>신고일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {/* reports가 배열인지 확인 후 map 호출 */}
                    {Array.isArray(reports) && reports.map(report => (
                        <tr key={report.reportId}>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>{report.reportId}</td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>
                                {report.reportType === 'post' ? '스레드' :
                                    report.reportType === 'review' ? '리뷰' :
                                        '댓글'}
                            </td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>{report.reporterNickname}</td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>{report.targetNickname}</td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>
                                {/* 신고 유형에 따라 게시글 제목 또는 댓글 내용을 표시 */}
                                {report.reportType === 'post' && report.postTitle}
                                {report.reportType === 'review' && report.reviewContent}
                                {report.reportType === 'comment' && report.commentContent}
                            </td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>{report.reportReason}</td>
                            <td onClick={() => handleRowClick(report.reportId, "report")}>{new Date(report.createdDate).toLocaleDateString()}</td>
                            <td>
                                <div className="admin-action-buttons-container">

                                    {/* 신고 대상 사용자의 ID가 있을 경우에만 '삭제' 버튼 표시 */}
                                    {report.targetUserId && (
                                        <button
                                            onClick={() => handleDeleteUser(report.targetUserId, report.targetNickname)}
                                            className="admin-action-button delete">
                                            삭제
                                        </button>
                                    )}
                                </div>            
                            </td>
                        </tr>
                    ))}
                    {/* reports가 비어있을 경우 메시지 표시 */}
                    {Array.isArray(reports) && reports.length === 0 && !searchTerm && (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center' }}>데이터가 없습니다.</td>
                        </tr>
                    )}
                    {Array.isArray(reports) && reports.length === 0 && searchTerm && (
                        <tr>
                            <td colSpan="9" style={{ textAlign: 'center' }}>검색 결과가 없습니다.</td>
                        </tr>
                    )}
                </tbody>
            </table>
            {totalPages > 1 && <PaginationControls />}
        </div>
    );
};

export default ReportList;
