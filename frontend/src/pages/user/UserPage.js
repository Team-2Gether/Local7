// src/pages/user/UserPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';

function UserPage({ currentUser }) {
    const [newUserLoginId, setNewUserLoginId] = useState('');
    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [verificationCode, setVerificationCode] = useState('');
    const [passwordChangeRequested, setPasswordChangeRequested] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState('');
    const [loginIdMessage, setLoginIdMessage] = useState('');
    const [loginIdMessageType, setLoginIdMessageType] = useState('');
    const [passwordMessage, setPasswordMessage] = useState('');
    const [passwordMessageType, setPasswordMessageType] = useState('');
    const [newUserNickname, setNewUserNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [nicknameMessageType, setNicknameMessageType] = useState('');

    const [withdrawalPassword, setWithdrawalPassword] = useState('');
    const [withdrawalVerificationCode, setWithdrawalVerificationCode] = useState('');
    const [withdrawalRequested, setWithdrawalRequested] = useState(false);

    // 새롭게 추가된 로딩 상태 변수들
    const [isUpdatingLoginId, setIsUpdatingLoginId] = useState(false);
    const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
    const [isRequestingWithdrawalCode, setIsRequestingWithdrawalCode] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);


    useEffect(() => {
        if (currentUser) {
            setNewUserLoginId(currentUser.userLoginId || '');
            setNewUserNickname(currentUser.userNickname || '');
        }
    }, [currentUser]);

    const displayMessage = (msg, type) => {
        setMessage(msg);
        setMessageType(type);
        setTimeout(() => {
            setMessage('');
            setMessageType('');
        }, 5000);
    };

    const displayLoginIdMessage = (msg, type) => {
        setLoginIdMessage(msg);
        setLoginIdMessageType(type);
        setTimeout(() => {
            setLoginIdMessage('');
            setLoginIdMessageType('');
        }, 5000);
    };

    const displayPasswordMessage = (msg, type) => {
        setPasswordMessage(msg);
        setPasswordMessageType(type);
        setTimeout(() => {
            setPasswordMessage('');
            setPasswordMessageType('');
        }, 5000);
    };

    const displayNicknameMessage = (msg, type) => {
        setNicknameMessage(msg);
        setNicknameMessageType(type);
        setTimeout(() => {
            setNicknameMessage('');
            setNicknameMessageType('');
        }, 5000);
    };

    const handleLoginIdChange = (e) => {
        setNewUserLoginId(e.target.value);
        setIsLoginIdChecked(false);
        setIsLoginIdAvailable(false);
        setLoginIdMessage('');
        setLoginIdMessageType('');
    };

    const handleNicknameChange = (e) => {
        setNewUserNickname(e.target.value);
        setIsNicknameChecked(false);
        setIsNicknameAvailable(false);
        setNicknameMessage('');
        setNicknameMessageType('');
    };

    const handleCheckLoginId = async () => {
        if (!newUserLoginId.trim()) {
            displayLoginIdMessage('새 아이디를 입력해주세요.', 'error');
            return;
        }
        if (currentUser && newUserLoginId === currentUser.userLoginId) {
            displayLoginIdMessage('현재 아이디와 동일합니다. 변경하려면 다른 아이디를 입력해주세요.', 'error');
            setIsLoginIdChecked(true);
            setIsLoginIdAvailable(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/check-loginid?userLoginId=${newUserLoginId}`);
            if (response.data.status === 'success') {
                setIsLoginIdChecked(true);
                setIsLoginIdAvailable(!response.data.isDuplicate);
                displayLoginIdMessage(response.data.message, response.data.isDuplicate ? 'error' : 'success');
            } else {
                displayLoginIdMessage(response.data.message || '아이디 중복 확인에 실패했습니다.', 'error');
                setIsLoginIdChecked(false);
                setIsLoginIdAvailable(false);
            }
        } catch (error) {
            console.error("아이디 중복 확인 중 오류 발생:", error);
            displayLoginIdMessage('아이디 중복 확인 중 오류가 발생했습니다.', 'error');
            setIsLoginIdChecked(false);
            setIsLoginIdAvailable(false);
        }
    };

    const handleUpdateLoginId = async () => {
        if (!isLoginIdChecked || !isLoginIdAvailable) {
            displayLoginIdMessage('먼저 아이디 중복 확인을 완료하고 사용 가능한 아이디를 입력해주세요.', 'error');
            return;
        }

        setIsUpdatingLoginId(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/update-loginid', { newUserLoginId: newUserLoginId });
            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('아이디가 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
            } else {
                displayMessage(response.data.message || '아이디 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("아이디 변경 중 오류 발생:", error);
            displayMessage('아이디 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingLoginId(false); // 로딩 종료
        }
    };

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            displayPasswordMessage('현재 비밀번호를 입력해주세요.', 'error');
            return;
        }

        setIsRequestingPasswordChange(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/request-password-change', { currentPassword });
            if (response.data.status === 'success') {
                setPasswordChangeRequested(true);
                displayPasswordMessage(response.data.message, 'success');
            } else {
                displayPasswordMessage(response.data.message || '비밀번호 변경 요청에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("비밀번호 변경 요청 중 오류 발생:", error);
            displayPasswordMessage(error.response?.data?.message || '비밀번호 변경 요청 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsRequestingPasswordChange(false); // 로딩 종료
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            displayPasswordMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error');
            return;
        }
        if (!verificationCode || !newPassword) {
            displayPasswordMessage('인증 코드와 새 비밀번호를 모두 입력해주세요.', 'error');
            return;
        }

        setIsResettingPassword(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/reset-password', { verificationCode, newPassword });
            if (response.data.status === 'success') {
                displayMessage(response.data.message, 'success');
                setPasswordChangeRequested(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setVerificationCode('');
            } else {
                displayPasswordMessage(response.data.message || '비밀번호 재설정에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("비밀번호 재설정 중 오류 발생:", error);
            displayPasswordMessage(error.response?.data?.message || '비밀번호 재설정 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsResettingPassword(false); // 로딩 종료
        }
    };

    const handleCheckNickname = async () => {
        if (!newUserNickname.trim()) {
            displayNicknameMessage('새 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (currentUser && newUserNickname === currentUser.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 변경하려면 다른 닉네임을 입력해주세요.', 'error');
            setIsNicknameChecked(true);
            setIsNicknameAvailable(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/user/check-nickname?userNickname=${newUserNickname}`);
            if (response.data.status === 'success') {
                setIsNicknameChecked(true);
                setIsNicknameAvailable(!response.data.isDuplicate);
                displayNicknameMessage(response.data.message, response.data.isDuplicate ? 'error' : 'success');
            } else {
                displayNicknameMessage(response.data.message || '닉네임 중복 확인에 실패했습니다.', 'error');
                setIsNicknameChecked(false);
                setIsNicknameAvailable(false);
            }
        } catch (error) {
            console.error("닉네임 중복 확인 중 오류 발생:", error);
            displayNicknameMessage('닉네임 중복 확인 중 오류가 발생했습니다.', 'error');
            setIsNicknameChecked(false);
            setIsNicknameAvailable(false);
        }
    };

    const handleUpdateNickname = async () => {
        if (!isNicknameChecked || !isNicknameAvailable) {
            displayNicknameMessage('먼저 닉네임 중복 확인을 완료하고 사용 가능한 닉네임을 입력해주세요.', 'error');
            return;
        }

        setIsUpdatingNickname(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/update-nickname', { newUserNickname: newUserNickname });
            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('닉네임이 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
            } else {
                displayMessage(response.data.message || '닉네임 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("닉네임 변경 중 오류 발생:", error);
            displayMessage('닉네임 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingNickname(false); // 로딩 종료
        }
    };

    const handleRequestWithdrawalVerification = async () => {
        setIsRequestingWithdrawalCode(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/request-withdrawal-verification');
            if (response.data.status === 'success') {
                setWithdrawalRequested(true);
                displayMessage(response.data.message, 'success');
            } else {
                displayMessage(response.data.message || '회원 탈퇴 인증 코드 발송에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("회원 탈퇴 인증 코드 요청 중 오류 발생:", error);
            displayMessage(error.response?.data?.message || '회원 탈퇴 인증 코드 요청 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsRequestingWithdrawalCode(false); // 로딩 종료
        }
    };

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        if (!withdrawalPassword || !withdrawalVerificationCode) {
            displayMessage('비밀번호와 인증 코드를 모두 입력해주세요.', 'error');
            return;
        }

        setIsWithdrawing(true); // 로딩 시작
        try {
            const response = await axios.post('http://localhost:8080/api/user/withdraw', {
                password: withdrawalPassword,
                verificationCode: withdrawalVerificationCode
            });
            if (response.data.status === 'success') {
                displayMessage(response.data.message, 'success');
                if (window.confirm("회원 탈퇴가 성공적으로 처리되었습니다. 확인을 누르면 로그인 페이지로 이동합니다.")) {
                    window.location.href = '/login';
                }
            } else {
                displayMessage(response.data.message || '회원 탈퇴에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
            displayMessage(error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsWithdrawing(false); // 로딩 종료
        }
    };


    return (
        <div className="user-page-container">
            <h2>내 정보</h2>
            {message && (
                <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            {/* 아이디 변경 섹션 */}
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
                        />
                        <button className="check-button" onClick={handleCheckLoginId}>중복 확인</button>
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
                    disabled={!isLoginIdChecked || !isLoginIdAvailable || isUpdatingLoginId} // 로딩 상태 추가
                >
                    {isUpdatingLoginId ? '변경 중...' : '아이디 변경'}
                </button>
            </div>

            {/* 닉네임 변경 섹션 */}
            <div className="user-update-form">
                <h3>닉네임 변경</h3>
                <div className="form-group">
                    <label htmlFor="userNickname">현재 닉네임:</label>
                    <input type="text" id="userNickname" value={currentUser?.userNickname || ''} disabled />
                </div>
                <div className="form-group">
                    <label htmlFor="newUserNickname">새 닉네임:</label>
                    <div className="input-with-button">
                        <input
                            type="text"
                            id="newUserNickname"
                            value={newUserNickname}
                            onChange={handleNicknameChange}
                            placeholder="새 닉네임을 입력하세요"
                        />
                        <button className="check-button" onClick={handleCheckNickname}>중복 확인</button>
                    </div>
                    {nicknameMessage && (
                        <div className={`message ${nicknameMessageType === 'success' ? 'success' : 'error'}`}>
                            {nicknameMessage}
                        </div>
                    )}
                </div>
                <button
                    className="submit-button"
                    onClick={handleUpdateNickname}
                    disabled={!isNicknameChecked || !isNicknameAvailable || isUpdatingNickname} // 로딩 상태 추가
                >
                    {isUpdatingNickname ? '변경 중...' : '닉네임 변경'}
                </button>
            </div>


            {/* 비밀번호 변경 섹션 */}
            <div className="user-update-form">
                <h3>비밀번호 변경</h3>
                {!passwordChangeRequested ? (
                    <form onSubmit={handleRequestPasswordChange}>
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
                        <button type="submit" className="submit-button" disabled={isRequestingPasswordChange}>
                            {isRequestingPasswordChange ? '요청 중...' : '비밀번호 변경 요청'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleResetPassword}>
                        <div className="form-group">
                            <label htmlFor="verificationCode">인증 코드:</label>
                            <input
                                type="text"
                                id="verificationCode"
                                value={verificationCode}
                                onChange={(e) => setVerificationCode(e.target.value)}
                                placeholder="이메일로 받은 6자리 코드"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="newPassword">새 비밀번호:</label>
                            <input
                                type="password"
                                id="newPassword"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="새 비밀번호"
                                required
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
                            />
                        </div>
                        <button type="submit" className="submit-button" disabled={isResettingPassword}>
                            {isResettingPassword ? '변경 중...' : '비밀번호 변경'}
                        </button>
                    </form>
                )}
                {passwordMessage && (
                    <div className={`message ${passwordMessageType === 'success' ? 'success' : 'error'}`}>
                        {passwordMessage}
                    </div>
                )}
            </div>

            {/* 회원 탈퇴 섹션 */}
            <div className="user-withdrawal-form user-update-form">
                <h3>회원 탈퇴</h3>
                <p className="warning-text">회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다. 신중하게 진행해주세요.</p>
                {!withdrawalRequested ? (
                    <button
                        className="delete-button"
                        onClick={handleRequestWithdrawalVerification}
                        disabled={isRequestingWithdrawalCode} // 로딩 상태 추가
                    >
                        {isRequestingWithdrawalCode ? '요청 중...' : '회원 탈퇴 인증 코드 요청'}
                    </button>
                ) : (
                    <form onSubmit={handleWithdrawal}>
                        <div className="form-group">
                            <label htmlFor="withdrawalPassword">비밀번호:</label>
                            <input
                                type="password"
                                id="withdrawalPassword"
                                value={withdrawalPassword}
                                onChange={(e) => setWithdrawalPassword(e.target.value)}
                                placeholder="비밀번호를 입력해주세요"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="withdrawalVerificationCode">인증 코드:</label>
                            <input
                                type="text"
                                id="withdrawalVerificationCode"
                                value={withdrawalVerificationCode}
                                onChange={(e) => setWithdrawalVerificationCode(e.target.value)}
                                placeholder="이메일로 받은 인증 코드"
                                required
                            />
                        </div>
                        <button type="submit" className="delete-button" disabled={isWithdrawing}>
                            {isWithdrawing ? '탈퇴 처리 중...' : '회원 탈퇴 완료'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserPage;