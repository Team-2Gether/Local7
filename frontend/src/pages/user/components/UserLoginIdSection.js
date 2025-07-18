// src/user/components/UserLoginIdSection.js
import React from 'react';
import useUserLoginId from '../hook/useUserLoginId';

function UserLoginIdSection({ currentUser, onLogout }) {
    const {
        newUserLoginId,
        handleLoginIdChange,
        handleCheckLoginId,
        handleRequestLoginIdChangeVerification,
        handleConfirmLoginIdChange,
        isLoginIdChecked,
        isLoginIdAvailable,
        isCheckingLoginId,
        isRequestingVerification,
        isVerificationRequested,
        verificationCode,
        handleVerificationCodeChange,
        isConfirmingLoginId,
        loginIdMessage,
        loginIdMessageType
    } = useUserLoginId(currentUser, onLogout);

    const isLoginIdValidForVerification = newUserLoginId.trim() !== '' && isLoginIdChecked && isLoginIdAvailable && newUserLoginId !== currentUser?.userLoginId;

    return (
        <div className="user-update-form">
            <h3>아이디 변경</h3>
            <div className="form-group">
                <label htmlFor="userLoginId">현재 아이디:</label>
                <input type="text" id="userLoginId" value={currentUser?.userLoginId || ''} disabled />
            </div>
            <div className="form-group">
                <label htmlFor="newUserLoginId">새 아이디:</label>
                <div className="input-with-button">
                    <input
                        type="text"
                        id="newUserLoginId"
                        value={newUserLoginId}
                        onChange={handleLoginIdChange}
                        placeholder="새 아이디를 입력하세요"
                        disabled={isCheckingLoginId || isRequestingVerification || isConfirmingLoginId || isVerificationRequested}
                    />
                    <button
                        className="check-button"
                        onClick={handleCheckLoginId}
                        disabled={isCheckingLoginId || isRequestingVerification || isConfirmingLoginId || isVerificationRequested}
                    >
                        {isCheckingLoginId ? '확인 중...' : '중복 확인'}
                    </button>
                </div>
                {loginIdMessage && loginIdMessageType !== 'success' && (
                    <div className={`message ${loginIdMessageType === 'success' ? 'success' : 'error'}`}>
                        {loginIdMessage}
                    </div>
                )}
            </div>

            {/* 인증 코드 요청 버튼 */}
            {!isVerificationRequested && (
                <button
                    className="submit-button"
                    onClick={handleRequestLoginIdChangeVerification}
                    disabled={!isLoginIdValidForVerification || isRequestingVerification || isConfirmingLoginId}
                >
                    {isRequestingVerification ? '인증 코드 요청 중...' : '인증 코드 요청'}
                </button>
            )}

            {/* 인증 코드 입력 필드 및 변경 버튼 */}
            {isVerificationRequested && (
                <div className="form-group">
                    <label htmlFor="verificationCode">인증 코드:</label>
                    <input
                        type="text"
                        id="verificationCode"
                        value={verificationCode}
                        onChange={handleVerificationCodeChange}
                        placeholder="이메일로 전송된 인증 코드를 입력하세요"
                        disabled={isConfirmingLoginId}
                    />
                    <button
                        className="submit-button"
                        onClick={handleConfirmLoginIdChange}
                        disabled={!verificationCode.trim() || isConfirmingLoginId}
                    >
                        {isConfirmingLoginId ? '아이디 변경 중...' : '아이디 변경'}
                    </button>
                </div>
            )}
        </div>
    );
}

export default UserLoginIdSection;