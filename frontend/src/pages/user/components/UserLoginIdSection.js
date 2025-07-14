// src/user/components/UserLoginIdSection.js
import React from 'react';
import useUserLoginId from '../hook/useUserLoginId'; // 경로 변경

function UserLoginIdSection({ currentUser, onLogout }) {
    const {
        newUserLoginId,
        handleLoginIdChange,
        handleCheckLoginId,
        handleUpdateLoginId,
        isLoginIdChecked,
        isLoginIdAvailable,
        isCheckingLoginId,
        isUpdatingLoginId,
        loginIdMessage,
        loginIdMessageType
    } = useUserLoginId(currentUser, onLogout);

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
                        disabled={isCheckingLoginId || isUpdatingLoginId}
                    />
                    <button
                        className="check-button"
                        onClick={handleCheckLoginId}
                        disabled={isCheckingLoginId || isUpdatingLoginId}
                    >
                        {isCheckingLoginId ? '확인 중...' : '중복 확인'}
                    </button>
                </div>
                {loginIdMessage && (
                    <div className={`message ${loginIdMessageType === 'success' ? 'success' : 'error'}`}>
                        {loginIdMessage}
                    </div>
                )}
            </div>
            <button
                className="submit-button"
                onClick={handleUpdateLoginId}
                disabled={!isLoginIdChecked || !isLoginIdAvailable || isUpdatingLoginId || isCheckingLoginId || newUserLoginId === currentUser?.userLoginId}
            >
                {isUpdatingLoginId ? '변경 중...' : '아이디 변경'}
            </button>
        </div>
    );
}

export default UserLoginIdSection;