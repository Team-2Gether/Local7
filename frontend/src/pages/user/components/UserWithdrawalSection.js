// src/user/components/UserWithdrawalSection.js
import React from 'react';
import useUserWithdrawal from '../hook/useUserWithdrawal'; // 경로 변경
import useFormData from '../../../common/useFormData'; // useFormData 훅 추가

function UserWithdrawalSection({ onLogout }) {
    const { formData, handleChange, setFormData } = useFormData({
        withdrawalPassword: '',
        withdrawalVerificationCode: ''
    }); // useFormData 훅 사용

    const {
        withdrawalRequested,
        handleRequestWithdrawalVerification,
        handleWithdrawal,
        isRequestingWithdrawalCode,
        isWithdrawing,
        withdrawalMessage,
        withdrawalMessageType
    } = useUserWithdrawal(onLogout, formData.withdrawalPassword, formData.withdrawalVerificationCode, setFormData); // useUserWithdrawal 훅에 formData 전달

    return (
        <div className="user-withdrawal-form user-update-form">
            <h3>회원 탈퇴</h3>
            <p className="warning-text">회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 신중하게 진행해주세요.</p>
            {!withdrawalRequested ? (
                <form onSubmit={(e) => handleRequestWithdrawalVerification(e)}>
                    <div className="form-group">
                        <label htmlFor="withdrawalPassword">현재 비밀번호:</label>
                        <input
                            type="password"
                            id="withdrawalPassword"
                            name="withdrawalPassword" // name 속성 추가
                            value={formData.withdrawalPassword}
                            onChange={handleChange}
                            placeholder="현재 비밀번호를 입력해주세요"
                            required
                            disabled={isRequestingWithdrawalCode}
                        />
                    </div>
                    <button
                        type="submit"
                        className="delete-button"
                        disabled={isRequestingWithdrawalCode}
                    >
                        {isRequestingWithdrawalCode ? '요청 중...' : '탈퇴 인증 코드 요청'}
                    </button>
                </form>
            ) : (
                <form onSubmit={(e) => handleWithdrawal(e)}>
                    <div className="form-group">
                        <label htmlFor="withdrawalPasswordConfirm">비밀번호 재확인:</label>
                        <input
                            type="password"
                            id="withdrawalPasswordConfirm"
                            name="withdrawalPassword" // name 속성 추가
                            value={formData.withdrawalPassword}
                            onChange={handleChange}
                            placeholder="비밀번호를 다시 입력하세요"
                            required
                            disabled={isWithdrawing}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="withdrawalVerificationCode">인증 코드:</label>
                        <input
                            type="text"
                            id="withdrawalVerificationCode"
                            name="withdrawalVerificationCode" // name 속성 추가
                            value={formData.withdrawalVerificationCode}
                            onChange={handleChange}
                            placeholder="이메일로 받은 6자리 코드"
                            required
                            disabled={isWithdrawing}
                        />
                    </div>
                    <button
                        type="submit"
                        className="delete-button"
                        disabled={isWithdrawing}
                    >
                        {isWithdrawing ? '탈퇴 처리 중...' : '회원 탈퇴'}
                    </button>
                </form>
            )}
            {withdrawalMessage && (
                <div className={`message ${withdrawalMessageType === 'success' ? 'success' : 'error'}`}>
                    {withdrawalMessage}
                </div>
            )}
        </div>
    );
}

export default UserWithdrawalSection;