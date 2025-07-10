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
    // 닉네임 관련 상태 추가
    const [newUserNickname, setNewUserNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false); // 닉네임 중복 확인 여부
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false); // 닉네임 사용 가능 여부
    const [nicknameMessage, setNicknameMessage] = useState('');
    const [nicknameMessageType, setNicknameMessageType] = useState('');


    useEffect(() => {
        if (currentUser) {
            setNewUserLoginId(currentUser.userLoginId || '');
            setNewUserNickname(currentUser.userNickname || ''); // 닉네임 초기값 설정
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

    // 닉네임 메시지 표시 함수 추가
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

    // 닉네임 변경 핸들러
    const handleNicknameChange = (e) => {
        setNewUserNickname(e.target.value);
        setIsNicknameChecked(false); // 닉네임 변경 시 중복 확인 상태 초기화
        setIsNicknameAvailable(false);
        setNicknameMessage(''); // 닉네임 변경 시 메시지 초기화
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

        try {
            const response = await axios.post('http://localhost:8080/api/user/update-loginid', {
                newUserLoginId: newUserLoginId
            });

            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('아이디가 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
                // window.location.reload(); // 새로고침 대신 세션 업데이트만으로 처리
            } else {
                displayMessage(response.data.message || '아이디 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("아이디 변경 중 오류 발생:", error);
            displayMessage('아이디 변경 중 오류가 발생했습니다.', 'error');
        }
    };

    // 닉네임 중복 확인 핸들러 추가
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

    // 닉네임 업데이트 핸들러 추가
    const handleUpdateNickname = async () => {
        if (!isNicknameChecked || !isNicknameAvailable) {
            displayNicknameMessage('먼저 닉네임 중복 확인을 완료하고 사용 가능한 닉네임을 입력해주세요.', 'error');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user/update-nickname', {
                newUserNickname: newUserNickname
            });

            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('닉네임이 성공적으로 변경되었습니다.', 'success');
                // 현재 사용자 정보 업데이트 (UI 즉시 반영)
                // currentUser 객체를 직접 수정하는 대신, 부모 컴포넌트의 상태 업데이트 함수를 호출하거나,
                // 세션을 다시 로드하여 최신 정보 반영 (여기서는 간단히 새로고침)
                window.location.reload();
            } else {
                displayNicknameMessage(response.data.message || '닉네임 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("닉네임 변경 중 오류 발생:", error);
            displayNicknameMessage('닉네임 변경 중 오류가 발생했습니다.', 'error');
        }
    };

    const handleRequestPasswordChange = async () => {
        if (!currentUser || !currentUser.userEmail) {
            displayPasswordMessage('이메일 정보가 없어 비밀번호 변경을 요청할 수 없습니다. 관리자에게 문의하세요.', 'error');
            return;
        }
        if (!currentPassword.trim()) {
            displayPasswordMessage('현재 비밀번호를 입력해주세요.', 'error');
            return;
        }

        try {
            const response = await axios.post('http://localhost:8080/api/user/request-password-change', {
                currentPassword: currentPassword
            });
            if (response.status === 200 && response.data.status === 'success') {
                displayPasswordMessage(response.data.message, 'success');
                setPasswordChangeRequested(true);
            } else {
                displayPasswordMessage(response.data.message || '인증 코드 발송에 실패했습니다. 현재 비밀번호를 확인해주세요.', 'error');
            }
        } catch (error) {
            console.error("비밀번호 변경 요청 중 오류 발생:", error);
            displayPasswordMessage('비밀번호 변경 요청 중 오류가 발생했습니다.', 'error');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            displayPasswordMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error');
            return;
        }
        if (!newPassword.trim() || !verificationCode.trim()) {
            displayPasswordMessage('새 비밀번호와 인증 코드를 모두 입력해주세요.', 'error');
            return;
            }

        try {
            const response = await axios.post('http://localhost:8080/api/user/reset-password', {
                verificationCode: verificationCode,
                newPassword: newPassword
            });

            if (response.status === 200 && response.data.status === 'success') {
                displayMessage('비밀번호가 성공적으로 변경되었습니다. 다시 로그인해야 합니다.', 'success');
                setPasswordChangeRequested(false);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setVerificationCode('');
                // window.location.reload(); // 새로고침 대신 세션 업데이트만으로 처리
            } else {
                displayPasswordMessage(response.data.message || '비밀번호 변경에 실패했습니다. 인증 코드를 확인해주세요.', 'error');
            }
        } catch (error) {
            console.error("비밀번호 재설정 중 오류 발생:", error);
            displayPasswordMessage('비밀번호 재설정 중 오류가 발생했습니다.', 'error');
        }
    };

    if (!currentUser) {
        return <div className="user-page-container"><h2>사용자 정보를 불러오는 중...</h2></div>;
    }

    return (
        <div className="user-page-container">
            {message && <div className={`global-message ${messageType}`}>{message}</div>}

            <div className="user-update-section">
                <h3>아이디 변경</h3>
                <div className="form-group">
                    <label htmlFor="newUserLoginId">새 아이디:</label>
                    <input
                        type="text"
                        id="newUserLoginId"
                        value={newUserLoginId}
                        onChange={handleLoginIdChange}
                        placeholder="새로운 아이디를 입력하세요"
                    />
                    {loginIdMessage && <div className={`input-message ${loginIdMessageType}`}>{loginIdMessage}</div>}
                    <button type="button" onClick={handleCheckLoginId} className="check-button">중복 확인</button>
                </div>
                {isLoginIdChecked && isLoginIdAvailable && (
                    <button
                        type="button"
                        onClick={handleUpdateLoginId}
                        className="submit-button"
                    >
                        아이디 변경
                    </button>
                )}
            </div>

            <hr className="divider" />

            {/* 닉네임 변경 섹션 추가 */}
            <div className="user-update-section">
                <h3>닉네임 변경</h3>
                <div className="form-group">
                    <label htmlFor="newUserNickname">새 닉네임:</label>
                    <input
                        type="text"
                        id="newUserNickname"
                        value={newUserNickname}
                        onChange={handleNicknameChange}
                        placeholder="새로운 닉네임을 입력하세요"
                    />
                    {nicknameMessage && <div className={`input-message ${nicknameMessageType}`}>{nicknameMessage}</div>}
                    <button type="button" onClick={handleCheckNickname} className="check-button">중복 확인</button>
                </div>
                {isNicknameChecked && isNicknameAvailable && ( // 닉네임 중복 확인 통과 시에만 변경 버튼 표시
                    <button
                        type="button"
                        onClick={handleUpdateNickname}
                        className="submit-button"
                    >
                        닉네임 변경
                    </button>
                )}
            </div>

            <hr className="divider" />

            <div className="user-update-section">
                <h3>비밀번호 변경</h3>
                <div className="form-group">
                    <label htmlFor="currentPassword">현재 비밀번호:</label>
                    <input
                        type="password"
                        id="currentPassword"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="현재 비밀번호를 입력하세요"
                        required
                    />
                    {passwordMessage && passwordMessageType === 'error' && <div className={`input-message ${passwordMessageType}`}>{passwordMessage}</div>}
                </div>
                {!passwordChangeRequested ? (
                    <p>비밀번호를 변경하려면 위 입력란에 현재 비밀번호를 입력 후 아래 버튼을 눌러 이메일 인증 코드를 받으세요. <br/>(현재 이메일: <strong>{currentUser.userEmail}</strong>)</p>
                ) : (
                    <p>등록된 이메일 (<strong>{currentUser.userEmail}</strong>)로 전송된 6자리 인증 코드를 확인하세요. <br/>코드는 5분간 유효합니다.</p>
                )}
                <button
                    type="button"
                    onClick={handleRequestPasswordChange}
                    className="request-code-button"
                    disabled={passwordChangeRequested || !currentPassword.trim()}
                >
                    인증 코드 받기
                </button>
                {passwordChangeRequested && passwordMessageType === 'success' && <div className={`input-message ${passwordMessageType}`}>{passwordMessage}</div>}


                {passwordChangeRequested && (
                    <form onSubmit={handleResetPassword} className="password-reset-form">
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
                        <button type="submit" className="submit-button">비밀번호 변경</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default UserPage;