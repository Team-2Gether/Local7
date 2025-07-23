// TermsOfServiceModal.jsx
import React, { useEffect } from 'react';
import '../assets/css/TermsOfServiceModal.css'; // 별도 CSS 파일을 import

// props 설명:
// isOpen: (필수) 모달이 현재 열려있는지 닫혀있는지를 제어하는 boolean 값.
//         이 prop이 true일 때 모달이 보이고, false일 때 사라집니다.
// onClose: (필수) '닫기' 버튼, 'X' 버튼 클릭 시, 또는 모달 외부 클릭 시 호출될 함수.
//          이 함수는 부모 컴포넌트에서 isOpen 상태를 false로 변경하는 역할을 해야 합니다.
// onAgree: (선택) '동의하기' 버튼 클릭 시 호출될 함수. (showAgreeButton이 true일 때만 호출)
// showAgreeButton: (선택, 기본값 true) '동의하기' 버튼을 표시할지 여부를 결정합니다.
const TermsOfServiceModal = ({ isOpen, onClose }) => {

    // 모달이 열릴 때 body 스크롤 방지, 닫힐 때 스크롤 복원
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'; // 스크롤바 숨김
        } else {
            document.body.style.overflow = 'unset'; // 스크롤바 복원
        }
        // 컴포넌트 언마운트 시 또는 isOpen이 false가 될 때 스크롤 복원
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    // isOpen이 false면 렌더링하지 않음 (모달 숨김)
    if (!isOpen) {
        return null;
    }

    // 모달 외부 클릭 시 닫기
    const handleOverlayClick = (e) => {
        // 클릭된 요소가 오버레이 자체인지 확인 (모달 내용 클릭 시 닫히지 않도록)
        if (e.target.className === 'terms-modal-overlay') {
            onClose();
        }
    };

    return (
        <div className="terms-modal-overlay" onClick={handleOverlayClick}>
            {/* 모달 내용 컨테이너 */}
            <div className="terms-of-service-container">
                {/* X 닫기 버튼 */}
                <button className="close-x-button" onClick={onClose}>
                    &times;
                </button>

                <div className="terms-of-service-header">
                    <h2>서비스 이용약관</h2>
                </div>
                <div className="terms-of-service-content">
                    <p>이 약관은 사이트명 또는 회사명이 제공하는 서비스(웹사이트, 모바일 앱 포함)의 이용과 관련하여 회사와 회원 간의 권리, 의무 및 책임사항 등을 규정함을 목적으로 합니다.</p>

                    <h3>제1조 (목적)</h3>
                    <p>1. "서비스"란 회사가 제공하는 모든 온라인 서비스 및 관련 제반 서비스를 의미합니다.</p>
                    <p>2. "회원"이란 본 약관에 동의하고 회사에 가입하여 서비스를 이용하는 모든 고객을 말합니다.</p>
                    <p>3. "아이디(ID)"란 회원 식별과 서비스 이용을 위하여 회원이 정하고 회사가 승인하여 주는 문자의 조합을 말합니다.</p>
                    <p>4. "비밀번호"란 회원이 부여받은 아이디와 일치되는 회원임을 확인하고 회원의 권익을 보호하기 위해 회원 자신이 정한 문자 또는 숫자의 조합을 말합니다.</p>

                    <h3>제2조 (약관의 효력 및 변경)</h3>
                    <ol>
                        <li>본 약관은 서비스를 이용하고자 하는 모든 회원에 대하여 그 효력이 발생합니다.</li>
                        <li>회사는 관련 법령을 위배하지 않는 범위 안에서 본 약관을 변경할 수 있으며, 약관이 변경될 경우에는 서비스 내 공지사항을 통해 사전에 공지합니다.</li>
                        <li>변경된 약관은 공지 시부터 효력이 발생하며, 회원이 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 요청할 수 있습니다.</li>
                    </ol>

                    <h3>제3조 (회원가입)</h3>
                    <ol>
                        <li>회원가입은 회원이 되고자 하는 자가 본 약관에 동의하고 회사가 정한 가입 양식에 따라 신청한 후 회사가 이를 승인함으로써 성립합니다.</li>
                        <li>회사는 다음 각 호에 해당하는 신청에 대하여는 승낙을 하지 않을 수 있습니다.</li>
                        <ol type="a">
                            <li>다른 사람의 명의를 사용하여 신청한 경우</li>
                            <li>허위의 정보를 기재하거나, 회사가 제시하는 내용을 기재하지 않은 경우</li>
                            <li>기타 회원으로 등록하는 것이 회사의 운영 방침상 부적절하다고 판단되는 경우</li>
                        </ol>
                    </ol>

                    <h3>제4조 (회원의 의무)</h3>
                    <ol>
                        <li>회원은 관계 법령, 본 약관의 규정, 이용안내 및 회사가 통지하는 사항을 준수하여야 합니다.</li>
                        <li>회원은 아이디와 비밀번호의 관리에 대한 책임이 있으며, 이를 제3자에게 이용하도록 해서는 안 됩니다.</li>
                        <li>회원은 자신의 아이디 및 비밀번호가 도용되거나 제3자가 사용하고 있음을 인지한 경우 즉시 회사에 통보해야 합니다.</li>
                    </ol>

                    <h3>제5조 (회사의 의무)</h3>
                    <ol>
                        <li>회사는 특별한 사정이 없는 한 회원이 이용신청을 한 날에 서비스를 이용할 수 있도록 합니다.</li>
                        <li>회사는 회원의 개인정보 보호를 위해 개인정보처리방침을 수립하고 준수합니다.</li>
                    </ol>

                    <h3>제6조 (서비스 이용의 제한 및 중지)</h3>
                    <ol>
                        <li>회사는 다음 각 호와 같은 경우 서비스 이용을 제한하거나 중지할 수 있습니다.</li>
                        <ol type="a">
                            <li>회원이 본 약관의 의무를 위반하거나 서비스의 정상적인 운영을 방해한 경우</li>
                            <li>천재지변, 국가비상사태 등 불가항력적인 사유가 발생한 경우</li>
                            <li>서비스용 설비의 보수, 교체 또는 고장, 서비스 이용의 폭주 등으로 정상적인 서비스 이용에 지장이 있는 경우</li>
                        </ol>
                        <li>회사는 전 항의 사유로 서비스 이용을 제한하거나 중지한 때에는 그 사유 및 기간 등을 회원에게 사전 또는 사후에 통지합니다.</li>
                    </ol>

                    <h3>제7조 (서비스의 변경 및 종료)</h3>
                    <ol>
                        <li>회사는 서비스의 일부 또는 전부를 회사의 정책 및 운영상, 기술상의 필요에 따라 변경하거나 종료할 수 있습니다.</li>
                        <li>회사가 서비스를 종료할 경우 회원은 종료일까지 및 사유를 회원에게 사전에 통지합니다.</li>
                    </ol>

                    <h3>제8조 (면책조항)</h3>
                    <ol>
                        <li>회사는 천재지변, 불가항력적 사유로 인하여 서비스를 제공할 수 없는 경우에는 그 책임을 지지 않습니다.</li>
                        <li>회사는 회원의 귀책사유로 인한 서비스 이용 장애에 대하여 책임을 지지 않습니다.</li>
                    </ol>

                    <h3>제9조 (준거법 및 분쟁해결)</h3>
                    <ol>
                        <li>본 약관의 해석 및 적용은 대한민국 법에 따릅니다.</li>
                        <li>서비스 이용과 관련하여 분쟁이 발생한 경우 관련 법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.</li>
                    </ol>
                </div>
                <div className="terms-of-service-footer">
                    <button className="close-button" onClick={onClose}>닫기</button>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServiceModal;