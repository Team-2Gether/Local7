// src/pages/user/UserPage.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './UserPage.css';
import { FaLock } from 'react-icons/fa'; // FaLock 아이콘 임포트
import { Link } from 'react-router-dom'; // Link 컴포넌트 임포트

function UserPage({ currentUser, onLogout }) { // onLogout prop 추가
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
    // 닉네임 관련 상태 추가
    const [newUserNickname, setNewUserNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복 확인 여부
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 닉네임 사용 가능 여부
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [nicknameMessageType, setNicknameMessageType] = useState('');

    // 회원 탈퇴 관련 상태 추가
    const [withdrawalPassword, setWithdrawalPassword] = useState('');
    const [withdrawalVerificationCode, setWithdrawalVerificationCode] = useState('');
    const [withdrawalRequested, setWithdrawalRequested] = useState(false); // 탈퇴 인증 코드 요청 여부
    const [withdrawalMessage, setWithdrawalMessage] = useState('');
    const [withdrawalMessageType, setWithdrawalMessageType] = useState('');

    // 중복 요청 방지를 위한 로딩 상태 추가
    const [isUpdatingLoginId, setIsUpdatingLoginId] = useState(false);
    const [isCheckingLoginId, setIsCheckingLoginId] = useState(false);
    const [isRequestingPasswordChange, setIsRequestingPasswordChange] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);
    const [isRequestingWithdrawalCode, setIsRequestingWithdrawalCode] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);


    useEffect(() => {
        if (currentUser) {
            setNewUserLoginId(currentUser.userLoginId || '');
            setNewUserNickname(currentUser.userNickname || '');
            // currentUser가 변경되면 닉네임 관련 상태도 초기화하여 '기본 상태'로 만듦
            setIsNicknameChecked(false);
            setIsNicknameAvailable(false);
            setNicknameMessage('');
            setNicknameMessageType('');
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

    const displayWithdrawalMessage = (msg, type) => {
        setWithdrawalMessage(msg);
        setWithdrawalMessageType(type);
        setTimeout(() => {
            setWithdrawalMessage('');
            setWithdrawalMessageType('');
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
        setIsNicknameChecked(false); // 닉네임이 변경되면 중복 확인 다시 필요
        setIsNicknameAvailable(false); // 닉네임이 변경되면 사용 가능 여부도 리셋
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

        setIsCheckingLoginId(true);
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
        } finally {
            setIsCheckingLoginId(false);
        }
    };

    const handleUpdateLoginId = async () => {
        if (!isLoginIdChecked || !isLoginIdAvailable) {
            displayLoginIdMessage('먼저 아이디 중복 확인을 완료하고 사용 가능한 아이디를 입력해주세요.', 'error');
            return;
        }
        if (newUserLoginId === currentUser.userLoginId) {
            displayLoginIdMessage('현재 아이디와 동일합니다. 변경하려면 다른 아이디를 입력해주세요.', 'error');
            return;
        }

        setIsUpdatingLoginId(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/update-loginid', { newUserLoginId: newUserLoginId });
            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('아이디가 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
                // 아이디 변경 성공 시, 사용자 정보 업데이트를 위해 onLogout 호출 또는 새로고침 유도
                if (onLogout) {
                    onLogout(); // 부모 컴포넌트에게 로그아웃 요청
                } else {
                    window.location.reload(); // 또는 페이지 새로고침
                }
            } else {
                displayMessage(response.data.message || '아이디 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("아이디 변경 중 오류 발생:", error);
            displayMessage(error.response?.data?.message || '아이디 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingLoginId(false);
        }
    };

    const handleRequestPasswordChange = async (e) => {
        e.preventDefault();
        if (!currentPassword) {
            displayPasswordMessage('현재 비밀번호를 입력해주세요.', 'error');
            return;
        }
        setIsRequestingPasswordChange(true);
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
            setIsRequestingPasswordChange(false);
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
        setIsResettingPassword(true);
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
            setIsResettingPassword(false);
        }
    };

    const handleCheckNickname = async () => {
        if (!newUserNickname.trim()) {
            displayNicknameMessage('새 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (currentUser && newUserNickname === currentUser.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 변경하려면 다른 닉네임을 입력해주세요.', 'error');
            setIsNicknameChecked(true); // 현재 닉네임과 동일하지만, 일단 확인은 된 것으로 처리
            setIsNicknameAvailable(false); // 그러나 변경 가능하지는 않음
            return;
        }

        setIsCheckingNickname(true);
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
        } finally {
            setIsCheckingNickname(false);
        }
    };

    const handleUpdateNickname = async () => {
        if (!isNicknameChecked || !isNicknameAvailable) {
            displayNicknameMessage('먼저 닉네임 중복 확인을 완료하고 사용 가능한 닉네임을 입력해주세요.', 'error');
            return;
        }
        // 이 조건은 이미 checkNickname에서 처리되므로, 여기서는 변경할 값이 있는지 확인
        if (newUserNickname === currentUser.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.', 'error');
            return;
        }

        setIsUpdatingNickname(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/update-nickname', { newUserNickname: newUserNickname });
            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('닉네임이 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
                // 닉네임 변경 성공 시 상태 초기화
                setIsNicknameChecked(false);
                setIsNicknameAvailable(false);
                setNicknameMessage('');
                setNicknameMessageType('');
                // 사용자 정보 업데이트를 위해 onLogout 호출 또는 새로고침 유도
                if (onLogout) {
                    onLogout(); // 부모 컴포넌트에게 로그아웃 요청 (세션 업데이트 목적)
                } else {
                    window.location.reload(); // 또는 페이지 새로고침
                }
            } else {
                displayMessage(response.data.message || '닉네임 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("닉네임 변경 중 오류 발생:", error);
            displayMessage(error.response?.data?.message || '닉네임 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingNickname(false);
        }
    };

    // 회원 탈퇴 인증 코드 요청 핸들러
    const handleRequestWithdrawalVerification = async (e) => {
        e.preventDefault();
        if (!withdrawalPassword) {
            displayWithdrawalMessage('탈퇴를 위해 현재 비밀번호를 입력해주세요.', 'error');
            return;
        }

        setIsRequestingWithdrawalCode(true);
        try {
            // 백엔드에 탈퇴 인증 코드 요청 (현재 비밀번호 검증 포함)
            const response = await axios.post('http://localhost:8080/api/user/request-withdrawal-verification', {
                password: withdrawalPassword
            });
            if (response.data.status === 'success') {
                setWithdrawalRequested(true);
                displayWithdrawalMessage(response.data.message, 'success');
            } else {
                displayWithdrawalMessage(response.data.message || '탈퇴 인증 코드 요청에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("탈퇴 인증 코드 요청 중 오류 발생:", error);
            displayWithdrawalMessage(error.response?.data?.message || '탈퇴 인증 코드 요청 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsRequestingWithdrawalCode(false);
        }
    };

    // 회원 탈퇴 처리 핸들러
    const handleWithdrawal = async (e) => {
        e.preventDefault();
        if (!withdrawalPassword || !withdrawalVerificationCode) {
            displayWithdrawalMessage('비밀번호와 인증 코드를 모두 입력해주세요.', 'error');
            return;
        }

        setIsWithdrawing(true);
        try {
            // 백엔드에 회원 탈퇴 요청 (비밀번호와 인증 코드 검증 포함)
            const response = await axios.post('http://localhost:8080/api/user/withdraw', {
                password: withdrawalPassword,
                verificationCode: withdrawalVerificationCode
            });
            if (response.data.status === 'success') {
                displayMessage('회원 탈퇴가 성공적으로 처리되었습니다.', 'success');
                // 탈퇴 성공 후, 세션 무효화 및 로그인 페이지로 리다이렉트
                if (onLogout) {
                    onLogout();
                } else {
                    // onLogout prop이 없을 경우 직접 리다이렉트 (필요에 따라 변경)
                    window.location.href = '/login';
                }
            } else {
                displayWithdrawalMessage(response.data.message || '회원 탈퇴에 실패했습니다.', 'error');
            }
        } catch (error) {
                console.error("회원 탈퇴 중 오류 발생:", error);
            displayWithdrawalMessage(error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsWithdrawing(false);
        }
    };


    return (
        <div className="user-page-container">
            <h2><FaLock /> 내 정보</h2> {/* FaLock 아이콘 추가 */}
            {message && (
                <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}

            <div className="user-page-content"> {/* 새로운 div로 컨텐츠를 묶습니다. */}
                <div className="user-page-navigation"> {/* 왼쪽에 배치될 네비게이션 섹션 */}
                    <ul>
                        <li><Link to="/mypage" className="nav-link">내 정보</Link></li> {/* MyPage 링크 추가 */}
                        <li><Link to="/userpage" className="nav-link active">회원 정보 수정</Link></li> {/* UserPage 링크 (현재 페이지) */}
                        {/* 다른 메뉴 항목들을 여기에 추가할 수 있습니다. */}
                    </ul>
                </div>

                <div className="user-update-sections-wrapper"> {/* 기존 섹션들을 감싸는 div 추가 */}
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
                                    disabled={isCheckingLoginId || isUpdatingLoginId} // 로딩 중 비활성화
                                />
                                <button
                                    className="check-button"
                                    onClick={handleCheckLoginId}
                                    disabled={isCheckingLoginId || isUpdatingLoginId} // 로딩 중 비활성화
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
                            // 중복 확인이 완료되지 않았거나, 사용 불가능하거나, 로딩 중이거나, 현재 아이디와 동일할 때 비활성화
                            disabled={!isLoginIdChecked || !isLoginIdAvailable || isUpdatingLoginId || isCheckingLoginId || newUserLoginId === currentUser?.userLoginId}
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
                                    disabled={isCheckingNickname || isUpdatingNickname} // 로딩 중 비활성화
                                />
                                <button
                                    className="check-button"
                                    onClick={handleCheckNickname}
                                    disabled={isCheckingNickname || isUpdatingNickname} // 로딩 중 비활성화
                                >
                                    {isCheckingNickname ? '확인 중...' : '중복 확인'}
                                </button>
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
                            // 중복 확인이 완료되지 않았거나, 사용 불가능하거나, 로딩 중이거나, 현재 닉네임과 동일할 때 비활성화
                            disabled={!isNicknameChecked || !isNicknameAvailable || isUpdatingNickname || isCheckingNickname || newUserNickname === currentUser?.userNickname}
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
                                        disabled={isRequestingPasswordChange} // 로딩 중 비활성화
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isRequestingPasswordChange} // 로딩 중 비활성화
                                >
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
                                        disabled={isResettingPassword} // 로딩 중 비활성화
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
                                        disabled={isResettingPassword} // 로딩 중 비활성화
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
                                        disabled={isResettingPassword} // 로딩 중 비활성화
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="submit-button"
                                    disabled={isResettingPassword} // 로딩 중 비활성화
                                >
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
                            <form onSubmit={handleRequestWithdrawalVerification}>
                                <div className="form-group">
                                    <label htmlFor="withdrawalPassword">현재 비밀번호:</label>
                                    <input
                                        type="password"
                                        id="withdrawalPassword"
                                        value={withdrawalPassword}
                                        onChange={(e) => setWithdrawalPassword(e.target.value)}
                                        placeholder="현재 비밀번호를 입력해주세요"
                                        required
                                        disabled={isRequestingWithdrawalCode} // 로딩 중 비활성화
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="delete-button"
                                    disabled={isRequestingWithdrawalCode} // 로딩 중 비활성화
                                >
                                    {isRequestingWithdrawalCode ? '요청 중...' : '탈퇴 인증 코드 요청'}
                                </button>
                            </form>
                        ) : (
                            <form onSubmit={handleWithdrawal}>
                                <div className="form-group">
                                    <label htmlFor="withdrawalPasswordConfirm">비밀번호 재확인:</label>
                                    <input
                                        type="password"
                                        id="withdrawalPasswordConfirm"
                                        value={withdrawalPassword}
                                        onChange={(e) => setWithdrawalPassword(e.target.value)}
                                        placeholder="비밀번호를 다시 입력하세요"
                                        required
                                        disabled={isWithdrawing} // 로딩 중 비활성화
                                    />
                                </div>
                                <div className="form-group">
                                    <label htmlFor="withdrawalVerificationCode">인증 코드:</label>
                                    <input
                                        type="text"
                                        id="withdrawalVerificationCode"
                                        value={withdrawalVerificationCode}
                                        onChange={(e) => setWithdrawalVerificationCode(e.target.value)}
                                        placeholder="이메일로 받은 6자리 코드"
                                        required
                                        disabled={isWithdrawing} // 로딩 중 비활성화
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="delete-button"
                                    disabled={isWithdrawing} // 로딩 중 비활성화
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
                </div> {/* user-update-sections-wrapper 닫기 */}
            </div> {/* user-page-content 닫기 */}
        </div>
    );
}

export default UserPage;