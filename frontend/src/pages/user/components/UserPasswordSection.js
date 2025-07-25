// src/user/components/UserPasswordSection.js
import React, { useState } from 'react';
import axios from 'axios';

function UserPasswordSection({ currentUser, onLogout }) { // onLogout prop을 받도록 수정
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordMessageType, setPasswordMessageType] = useState('');
    const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
    const [isCheckingCurrentPassword, setIsCheckingCurrentPassword] = useState(false);
    const [currentPasswordCheckMessage, setCurrentPasswordCheckMessage] = useState('');
    const [currentPasswordCheckMessageType, setCurrentPasswordCheckMessageType] = useState('');

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        if (name === 'currentPassword') {
            setCurrentPassword(value);
            setCurrentPasswordCheckMessage('');
            setCurrentPasswordCheckMessageType('');
        } else if (name === 'newPassword') {
            setNewPassword(value);
        } else if (name === 'confirmNewPassword') {
            setConfirmNewPassword(value);
        }
        setPasswordMessage('');
    };

    // 현재 비밀번호 확인 핸들러
    const handleCheckCurrentPassword = async () => {
        if (!currentUser || !currentUser.userId) {
            setCurrentPasswordCheckMessage('사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
            setCurrentPasswordCheckMessageType('error');
            return;
        }
        if (!currentPassword) {
            setCurrentPasswordCheckMessage('현재 비밀번호를 입력해주세요.');
            setCurrentPasswordCheckMessageType('error');
            return;
        }

        setIsCheckingCurrentPassword(true);
        setCurrentPasswordCheckMessage('');
        setCurrentPasswordCheckMessageType('');

        try {
            //
            const response = await axios.post( // axios.post 사용
                'http://192.168.0.10:8080/api/user/check-password', //
                new URLSearchParams({ // URLSearchParams 사용하여 x-www-form-urlencoded 유지
                    userId: currentUser.userId,
                    password: currentPassword,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const data = response.data; // axios는 응답 데이터를 response.data로 제공

            if (data.isPasswordCorrect) { // isPasswordCorrect는 백엔드 응답에 따라 달라질 수 있음
                setCurrentPasswordCheckMessage('현재 비밀번호가 확인되었습니다.');
                setCurrentPasswordCheckMessageType('success');
            } else {
                setCurrentPasswordCheckMessage(data.message || '현재 비밀번호가 올바르지 않습니다.');
                setCurrentPasswordCheckMessageType('error');
            }
        } catch (error) {
            console.error('현재 비밀번호 확인 오류:', error);
            if (error.response) {
                // 서버에서 응답이 왔지만 오류 상태 코드인 경우
                setCurrentPasswordCheckMessage(error.response.data.message || '현재 비밀번호 확인 중 오류가 발생했습니다.');
                setCurrentPasswordCheckMessageType('error');
            } else if (error.request) {
                // 요청이 전송되었지만 응답을 받지 못한 경우 (네트워크 오류 등)
                setCurrentPasswordCheckMessage('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
                setCurrentPasswordCheckMessageType('error');
            } else {
                // 그 외 오류
                setCurrentPasswordCheckMessage('비밀번호 확인 중 알 수 없는 오류가 발생했습니다.');
                setCurrentPasswordCheckMessageType('error');
            }
        } finally {
            setIsCheckingCurrentPassword(false);
        }
    };

    const handleUpdatePassword = async () => {
        if (!currentUser || !currentUser.userId) {
            setPasswordMessage('사용자 정보를 찾을 수 없습니다. 다시 로그인 해주세요.');
            setPasswordMessageType('error');
            return;
        }

        if (newPassword !== confirmNewPassword) {
            setPasswordMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            setPasswordMessageType('error');
            return;
        }

        if (newPassword.length < 8) {
            setPasswordMessage('새 비밀번호는 최소 8자 이상이어야 합니다.');
            setPasswordMessageType('error');
            return;
        }

        if (currentPassword === newPassword) {
            setPasswordMessage('새 비밀번호는 현재 비밀번호와 달라야 합니다.');
            setPasswordMessageType('error');
            return;
        }

        setIsUpdatingPassword(true);
        setPasswordMessage('');
        setPasswordMessageType('');

        try {
            // 1. 현재 비밀번호 확인 API 호출 (비밀번호 변경 전에 다시 한번 확인)
            //
            const checkPasswordResponse = await axios.post( // axios.post 사용
                'http://192.168.0.10:8080/api/user/check-password', //
                new URLSearchParams({
                    userId: currentUser.userId,
                    password: currentPassword,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const checkPasswordData = checkPasswordResponse.data;

            if (!checkPasswordData.isPasswordCorrect) {
                setPasswordMessage(checkPasswordData.message || '현재 비밀번호가 올바르지 않습니다.');
                setPasswordMessageType('error');
                setIsUpdatingPassword(false);
                return;
            }

            // 2. 비밀번호 변경 API 호출
            //
            const changePasswordResponse = await axios.post( // axios.post 사용
                'http://192.168.0.10:8080/api/user/change-password', //
                new URLSearchParams({
                    userId: currentUser.userId,
                    currentPassword: currentPassword,
                    newPassword: newPassword,
                }).toString(),
                {
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                }
            );

            const changePasswordData = changePasswordResponse.data;

            if (changePasswordData.status === 'success') { // 백엔드 응답 `status` 필드 확인
                setPasswordMessage('비밀번호가 성공적으로 변경되었습니다. 다시 로그인 해주세요.'); // 메시지 변경
                setPasswordMessageType('success');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
                setCurrentPasswordCheckMessage('');
                setCurrentPasswordCheckMessageType('');
                onLogout(); // 비밀번호 변경 성공 시 로그아웃 함수 호출
            } else {
                setPasswordMessage(changePasswordData.message || '비밀번호 변경에 실패했습니다.');
                setPasswordMessageType('error');
            }
        } catch (error) {
            console.error('비밀번호 변경 오류:', error);
            if (error.response) {
                setPasswordMessage(error.response.data.message || '비밀번호 변경 중 오류가 발생했습니다.');
                setPasswordMessageType('error');
            } else if (error.request) {
                setPasswordMessage('서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.');
                setPasswordMessageType('error');
            } else {
                setPasswordMessage('비밀번호 변경 중 알 수 없는 오류가 발생했습니다.');
                setPasswordMessageType('error');
            }
        } finally {
            setIsUpdatingPassword(false);
        }
    };

    const isCheckCurrentPasswordDisabled = !currentPassword || isCheckingCurrentPassword;
    const isUpdateDisabled = !currentPassword || !newPassword || !confirmNewPassword || newPassword !== confirmNewPassword || newPassword.length < 8 || isUpdatingPassword || currentPassword === newPassword;

    return (
        <div className="user-update-form">
            <h3>비밀번호 변경</h3>
            <div className="form-group">
                <label htmlFor="currentPassword">현재 비밀번호:</label>
                <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={currentPassword}
                    onChange={handlePasswordChange}
                    placeholder="현재 비밀번호를 입력하세요"
                    required
                    disabled={isUpdatingPassword || isCheckingCurrentPassword}
                />
                <button
                    className="check-button"
                    onClick={handleCheckCurrentPassword}
                    disabled={isCheckCurrentPasswordDisabled}
                >
                    {isCheckingCurrentPassword ? '확인 중...' : '현재 비밀번호 확인'}
                </button>
            </div>
            {currentPasswordCheckMessage && (
                <div className={`message ${currentPasswordCheckMessageType === 'success' ? 'success' : 'error'}`}>
                    {currentPasswordCheckMessage}
                </div>
            )}
            <div className="form-group">
                <label htmlFor="newPassword">새 비밀번호:</label>
                <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호를 입력하세요 (8자 이상)"
                    required
                    disabled={isUpdatingPassword}
                />
            </div>
            <div className="form-group">
                <label htmlFor="confirmNewPassword">새 비밀번호 확인:</label>
                <input
                    type="password"
                    id="confirmNewPassword"
                    name="confirmNewPassword"
                    value={confirmNewPassword}
                    onChange={handlePasswordChange}
                    placeholder="새 비밀번호를 다시 입력하세요"
                    required
                    disabled={isUpdatingPassword}
                />
            </div>
            {passwordMessage && (
                <div className={`message ${passwordMessageType === 'success' ? 'success' : 'error'}`}>
                    {passwordMessage}
                </div>
            )}
            <button
                className="submit-button"
                onClick={handleUpdatePassword}
                disabled={isUpdateDisabled}
            >
                {isUpdatingPassword ? '변경 중...' : '비밀번호 변경'}
            </button>
        </div>
    );
}

export default UserPasswordSection;