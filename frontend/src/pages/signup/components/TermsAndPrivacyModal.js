// src/pages/signup/components/TermsAndPrivacyModal.js
import React from 'react';
import './TermsAndPrivacyModal.css'; // 모달 스타일을 위한 CSS 파일 (필요 시 생성)

function TermsAndPrivacyModal({ onClose }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>서비스 이용약관 및 개인정보 처리방침</h3>
        <div className="modal-scroll-content">
          <h4>서비스 이용약관</h4>
          <p>
            [서비스 이용약관 내용입니다. 이곳에 실제 약관 텍스트를 입력하거나, 서버에서 불러와 표시할 수 있습니다.]
            <br />
            예시: 본 서비스는 ~~~에 대한 권리와 의무를 규정합니다. 회원은 약관을 준수해야 합니다.
            <br />
            ... (더 많은 이용약관 내용) ...
          </p>
          <h4>개인정보 처리방침</h4>
          <p>
            [개인정보 처리방침 내용입니다. 이곳에 실제 처리방침 텍스트를 입력하거나, 서버에서 불러와 표시할 수 있습니다.]
            <br />
            예시: 회사는 회원의 개인정보를 ~~~ 목적으로 수집하며, ~~~ 기간 동안 보관합니다.
            <br />
            ... (더 많은 개인정보 처리방침 내용) ...
          </p>
        </div>
        <button onClick={onClose} className="modal-close-button">닫기</button>
      </div>
    </div>
  );
}

export default TermsAndPrivacyModal;