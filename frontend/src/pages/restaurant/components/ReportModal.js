import React, { useState } from 'react';
import Modal from 'react-modal';
import './ReportModal.css'; // 모달 스타일을 위한 CSS 파일

// 모달을 애플리케이션 루트 요소에 연결
Modal.setAppElement('#root');

/**
 * 신고 모달 컴포넌트
 * @param {object} props
 * @param {boolean} props.isOpen - 모달이 열려 있는지 여부
 * @param {function} props.onClose - 모달 닫기 함수
 * @param {function} props.onReport - 신고 제출 함수 (인자로 신고 사유를 전달)
 * @param {string} props.target - 무엇을 신고하는지 (예: '리뷰')
 */
function ReportModal({ isOpen, onClose, onReport, target }) {
    const [reportReason, setReportReason] = useState('');

    const handleReportSubmit = () => {
        // 입력된 신고 사유가 없으면 경고
        if (!reportReason.trim()) {
            alert('신고 사유를 입력해 주세요.');
            return;
        }
        // 부모 컴포넌트에서 받은 onReport 함수를 호출
        onReport(reportReason);
        // 신고 사유 상태 초기화 및 모달 닫기
        setReportReason('');
        onClose();
    };

    const handleCancel = () => {
        setReportReason('');
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={handleCancel}
            contentLabel="Report Modal"
            className="report-modal"
            overlayClassName="report-modal-overlay"
        >
            <div className="modal-content">
                <h3>{target} 신고</h3>
                <p>신고 사유를 자세히 작성해 주세요.</p>
                <textarea
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    rows="5"
                    placeholder="예: 욕설, 비방, 허위 정보, 광고 등"
                />
                <div className="modal-actions">
                    <button onClick={handleReportSubmit} className="report-button">
                        신고하기
                    </button>
                    <button onClick={handleCancel} className="cancel-button">
                        취소
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default ReportModal;