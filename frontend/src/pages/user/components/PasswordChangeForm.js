// src/pages/user/PasswordChangeForm.js
import React, { useState, useEffect } from 'react';
import usePasswordChange from '../hook/usePasswordChange'; // 커스텀 훅 임포트
// import '../../assets/css/MyPage.css';

function PasswordChangeForm({ currentUser }) {
    const { isLoading, error, successMessage, checkPassword, changePassword, setError, setSuccessMessage } = usePasswordChange();

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordVerified, setPasswordVerified] = useState(false); // 비밀번호 확인 단계 통과 여부

    useEffect(() => {
        // 컴포넌트 마운트 시 또는 currentUser 변경 시 메시지 초기화
        setError(null);
        setSuccessMessage(null);
        setPasswordVerified(false);
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
    }, [currentUser, setError, setSuccessMessage]);

    const handleCheckPassword = async (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.userId) {
            setError("사용자 정보를 찾을 수 없습니다.");
            return;
        }

        const isCorrect = await checkPassword(currentUser.userId, currentPassword);
        if (isCorrect) {
            setPasswordVerified(true);
            // 현재 비밀번호 필드는 유지하거나 초기화할 수 있음.
            // 여기서는 보안상 초기화하는 것으로 가정. (UI에 따라 다름)
            // setCurrentPassword(''); 
        } else {
            setPasswordVerified(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.userId) {
            setError("사용자 정보를 찾을 수 없습니다.");
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setError("새 비밀번호와 비밀번호 확인이 일치하지 않습니다.");
            return;
        }
        if (newPassword.length < 6) { // 최소 길이 제한 예시
            setError("새 비밀번호는 최소 6자 이상이어야 합니다.");
            return;
        }
        if (currentPassword === newPassword) {
            setError("새 비밀번호는 현재 비밀번호와 달라야 합니다.");
            return;
        }

        const success = await changePassword(currentUser.userId, currentPassword, newPassword);
        if (success) {
            // 비밀번호 변경 성공 시 필드 초기화 및 상태 초기화
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setPasswordVerified(false); // 다시 비밀번호 확인 단계로 돌아가도록
        }
    };

    return (
        <div className="password-change-section">
            <h2>비밀번호 변경</h2>
            {error && <p className="error-message">{error}</p>}
            {successMessage && <p className="success-message">{successMessage}</p>}
            {isLoading && <p>처리 중...</p>}

            {!passwordVerified ? (
                // 1단계: 현재 비밀번호 확인
                <form onSubmit={handleCheckPassword} className="password-form">
                    <div className="form-group">
                        <label htmlFor="currentPasswordCheck">현재 비밀번호:</label>
                        <input
                            type="password"
                            id="currentPasswordCheck"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        비밀번호 확인
                    </button>
                </form>
            ) : (
                // 2단계: 새 비밀번호 변경
                <form onSubmit={handleChangePassword} className="password-form">
                    <div className="form-group">
                        <label htmlFor="newPassword">새 비밀번호:</label>
                        <input
                            type="password"
                            id="newPassword"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirmNewPassword">새 비밀번호 확인:</label>
                        <input
                            type="password"
                            id="confirmNewPassword"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                            required
                            disabled={isLoading}
                        />
                    </div>
                    <button type="submit" className="submit-button" disabled={isLoading}>
                        비밀번호 변경
                    </button>
                    <button type="button" className="cancel-button" onClick={() => {
                        setPasswordVerified(false);
                        setCurrentPassword('');
                        setNewPassword('');
                        setConfirmNewPassword('');
                        setError(null);
                        setSuccessMessage(null);
                    }} disabled={isLoading}>
                        취소
                    </button>
                </form>
            )}
        </div>
    );
}

export default PasswordChangeForm;