import React, { useState } from 'react';
import axios from 'axios';


function ForgetIdOrPWD() {
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('requestEmail'); // 'requestEmail', 'verifyCode', 'resetPassword'

    // 이메일로 인증 코드 전송
    const handleSendCode = async () => {
        if (!email) {
            setMessage('이메일을 입력해주세요.');
            return;
        }
        try {
            // Spring Boot 백엔드에 인증 코드 요청
            const response = await axios.post('http://localhost:8080/api/api/forget/sendCode', { email });
            setMessage(response.data.message);
            if (response.data.success) {
                setStep('verifyCode'); // 다음 단계로 이동
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '인증 코드 전송 중 오류가 발생했습니다.');
        }
    };

    // 인증 코드 확인
    const handleVerifyCode = async () => {
        if (!email || !authCode) {
            setMessage('이메일과 인증 코드를 입력해주세요.');
            return;
        }
        try {
            // Spring Boot 백엔드에 인증 코드 확인 요청
            const response = await axios.post('http://localhost:8080/api/api/forget/verifyCode', { email, authCode });
            setMessage(response.data.message);
            if (response.data.success) {
                // 아이디를 찾은 경우 (비밀번호 변경 없이 아이디만 보여줄 경우)
                if (response.data.foundId) {
                    setMessage(`귀하의 아이디는 "${response.data.foundId}" 입니다.`);
                    setStep('showId'); // 아이디만 보여주는 단계로 이동
                } else {
                    // 비밀번호 변경 단계로 이동
                    setStep('resetPassword');
                }
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.');
        }
    };

    // 비밀번호 재설정
    const handleResetPassword = async () => {
        if (!email || !authCode || !newPassword || !confirmNewPassword) {
            setMessage('모든 필드를 입력해주세요.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setMessage('새 비밀번호가 일치하지 않습니다.');
            return;
        }
        try {
            // Spring Boot 백엔드에 비밀번호 재설정 요청
            const response = await axios.post('http://localhost:8080/api/api/forget/resetPassword', { email, authCode, newPassword });
            setMessage(response.data.message);
            if (response.data.success) {
                setStep('completed'); // 완료 단계로 이동
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '비밀번호 재설정 중 오류가 발생했습니다.');
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 'requestEmail':
                return (
                    <div>
                        <h2>아이디 또는 비밀번호 찾기</h2>
                        <p>등록된 이메일 주소를 입력해주세요. 인증 코드를 보내드립니다.</p>
                        <input
                            type="email"
                            placeholder="이메일 주소"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSendCode}>인증 코드 전송</button>
                    </div>
                );
            case 'verifyCode':
                return (
                    <div>
                        <h2>인증 코드 확인</h2>
                        <p>{email} (으)로 전송된 인증 코드를 입력해주세요.</p>
                        <input
                            type="text"
                            placeholder="인증 코드"
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                        />
                        <button onClick={handleVerifyCode}>코드 확인</button>
                    </div>
                );
            case 'resetPassword':
                return (
                    <div>
                        <h2>새 비밀번호 설정</h2>
                        <input
                            type="password"
                            placeholder="새 비밀번호"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <input
                            type="password"
                            placeholder="새 비밀번호 확인"
                            value={confirmNewPassword}
                            onChange={(e) => setConfirmNewPassword(e.target.value)}
                        />
                        <button onClick={handleResetPassword}>비밀번호 변경</button>
                    </div>
                );
            case 'showId':
                return (
                    <div>
                        <h2>아이디 찾기 완료</h2>
                        <p>{message}</p>
                        <button onClick={() => window.location.href = '/login'}>로그인 페이지로 이동</button>
                    </div>
                );
            case 'completed':
                return (
                    <div>
                        <h2>완료되었습니다.</h2>
                        <p>{message}</p>
                        <button onClick={() => window.location.href = '/login'}>로그인 페이지로 이동</button>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="forgetIdOrPWD-container">
            {renderStepContent()}
            {message && <p className="message">{message}</p>}
        </div>
    );
}

export default ForgetIdOrPWD;