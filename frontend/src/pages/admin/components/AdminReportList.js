import React from 'react';

const ReportList = ({ reports, searchTerm, setSearchTerm, handleUpdateReportStatus, handleDeleteUser }) => {
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
                        <th>상태</th>
                        <th>신고일</th>
                        <th>관리</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        reports.map(report => (
                            <tr key={report.reportId}>
                                <td>{report.reportId}</td>
                                <td>
                                    {report.reportType === 'post' ? '스레드' :
                                        report.reportType === 'review' ? '리뷰' :
                                            '댓글'}
                                </td>
                                <td>{report.reporterNickname}</td>
                                <td>{report.targetNickname}</td>
                                <td>
                                    {/* 신고 유형에 따라 게시글 제목 또는 댓글 내용을 표시 */}
                                    {report.reportType === 'post' && report.postTitle}
                                    {report.reportType === 'review' && report.reviewContent}
                                    {report.reportType === 'comment' && report.commentContent}
                                </td>
                                <td>{report.reportReason}</td>
                                <td>{report.status === 'PENDING' ? '대기 중' : '처리 완료'}</td>
                                <td>{new Date(report.createdDate).toLocaleDateString()}</td>
                                <td>
                                    {
                                        report.status === 'PENDING'
                                            ? (
                                                <div className="admin-action-buttons-container">
                                                    <button
                                                        onClick={() => handleUpdateReportStatus(report.reportId, 'COMPLETED')}
                                                        className="admin-action-button complete">
                                                        처리
                                                    </button>

                                                    {/* 신고 대상 사용자의 ID가 있을 경우에만 '삭제' 버튼 표시 */}
                                                    {report.targetUserId && (
                                                        <button
                                                            onClick={() => handleDeleteUser(report.targetUserId, report.targetNickname)}
                                                            className="admin-action-button delete">
                                                            삭제
                                                        </button>
                                                    )}
                                                </div>
                                            )
                                            : (<span>처리 완료됨</span>)
                                    }
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    );
};

export default ReportList;
