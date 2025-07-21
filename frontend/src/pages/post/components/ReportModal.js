import React, { useState } from 'react';
import './ReportModal.css'; // 모달 스타일을 위한 CSS 파일

const ReportModal = ({ isOpen, onClose, onReport, title, target }) => {
    const [reportReason, setReportReason] = useState('');

    const handleReport = () => {
        if (reportReason.trim() === '') {
            alert('신고 사유를 입력해주세요.');
            return;
        }
        onReport(reportReason);
        setReportReason(''); // 신고 사유 초기화
        onClose(); // 모달 닫기
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div className="modal-backdrop11">
            <div className="modal-content11">
                <h3>{target} 신고하기</h3>
                <p>신고 사유를 구체적으로 작성해 주세요.</p>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    placeholder="신고 사유를 입력하세요..."
                    rows="5"
                />
                <div className="modal-actions11">
                    <button onClick={handleReport} className="modal-button submit11">신고</button>
                    <button onClick={onClose} className="modal-button cancel11">취소</button>
                </div>
            </div>
        </div>
    );
};

export default ReportModal;