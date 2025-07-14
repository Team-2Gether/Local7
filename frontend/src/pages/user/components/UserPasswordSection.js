// src/user/components/UserPasswordSection.js
import React from 'react';
import useUserPassword from '../hook/useUserPassword'; // 경로 변경

function UserPasswordSection() {
    const {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showNewPasswordFields,
        handleConfirmCurrentPassword,
        handleResetPassword,
        isResettingPassword,
        passwordMessage,
        passwordMessageType
    } = useUserPassword();

    return (
        <div className="user-update-form">
            <h3>비밀번호 변경</h3>
            {passwordMessage && (
                <div className={`message ${passwordMessageType === 'success' ? 'success' : 'error'}`}>
                    {passwordMessage}
                </div>
            )}
            {!showNewPasswordFields ? (
                <form onSubmit={handleConfirmCurrentPassword}>
                    <div className="form-group">
                        <label htmlFor="currentPassword">현재 비밀번호:</label>
                        <input
                            type="password"
                            id="currentPassword"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="현재 비밀번호를 입력해주세요"
                            required
                        />
                    </div>
                    <button type="submit" className="submit-button">
                        확인
                    </button>
                </form>
            ) : (
                <form onSubmit={handleResetPassword}>
                    <div className="form-group">
                        <label htmlFor="newPassword">새 비밀번호:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="새 비밀번호"
                            required
                            disabled={isResettingPassword}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmPassword">비밀번호 확인:</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="새 비밀번호 확인"
                            required
                            disabled={isResettingPassword}
                        />
                    </div>
                    <button
                        type="submit"
                        className="submit-button"
                        disabled={isResettingPassword}
                    >
                        {isResettingPassword ? '변경 중...' : '비밀번호 변경'}
                    </button>
                </form>
            )}
        </div>
    );
}

export default UserPasswordSection;