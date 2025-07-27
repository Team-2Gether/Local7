// src/pages/forget/ForgetIdOrPWD.js
import React, { useState } from 'react';
import axios from 'axios';
import "../../assets/css/ForgetIdOrPWD.css";

// onCloseModal prop 추가
function ForgetIdOrPWD({ onCloseModal }) {
    const [email, setEmail] = useState('');
    const [authCode, setAuthCode] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [message, setMessage] = useState('');
    const [step, setStep] = useState('requestEmail'); // 'requestEmail', 'verifyCode', 'resetPassword', 'completed'

    // 이메일로 인증 코드 전송
    const handleSendCode = async () => {
        if (!email) {
            setMessage('이메일을 입력해주세요.');
            return;
        }
        try {
            // Spring Boot 백엔드에 인증 코드 요청
            const response = await axios.post('http://localhost:8080/api/forget/sendCode', { email });
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
            const response = await axios.post('http://localhost:8080/api/forget/verifyCode', { email, authCode });
            setMessage(response.data.message);
            if (response.data.success) {
                setStep('resetPassword'); // 인증 성공 시 비밀번호 재설정 단계로 이동
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.');
        }
    };

    // 비밀번호 재설정
    const handleResetPassword = async () => {
        if (!newPassword || !confirmNewPassword) {
            setMessage('새 비밀번호와 비밀번호 확인을 입력해주세요.');
            return;
        }
        if (newPassword !== confirmNewPassword) {
            setMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.');
            return;
        }

        try {
            // Spring Boot 백엔드에 비밀번호 재설정 요청
            const response = await axios.post('http://localhost:8080/api/forget/resetPassword', {
                email,
                authCode,
                newPassword,
            });
            setMessage(response.data.message);
            if (response.data.success) {
                setStep('completed'); // 완료 단계로 이동
            }
        } catch (error) {
            setMessage(error.response?.data?.message || '비밀번호 재설정 중 오류가 발생했습니다.');
        }
    };

    // 현재 단계에 따른 UI 렌더링
    const renderStepContent = () => {
        switch (step) {
            case 'requestEmail':
                return (
                    <div>
                        <h2>비밀번호 재설정</h2>
                        <input
                            type="email"
                            placeholder="이메일 입력"
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
                        <p>입력하신 이메일로 전송된 인증 코드를 입력해주세요.</p>
                        <input
                            type="text"
                            placeholder="인증 코드 입력"
                            value={authCode}
                            onChange={(e) => setAuthCode(e.target.value)}
                        />
                        <button onClick={handleVerifyCode}>코드 확인</button>
                    </div>
                );
            case 'resetPassword':
                return (
                    <div>
                        <h2>비밀번호 재설정</h2>
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
            case 'completed':
                return (
                    <div>
                        <h2>완료되었습니다.</h2>
                        <p>{message}</p>
                        <button onClick={onCloseModal}>로그인 페이지로 돌아가기</button> {/* 로그인 페이지로 이동 대신 모달 닫기 */}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="forgetIdOrPWD-container">
            <div className="forgetIdOrPWD-container1">
                <div className="forgetIdOrPWD-Btn" onClick={onCloseModal} >&times;</div>
                {renderStepContent()}
                {message && <p className="message">{message}</p>}             
        </div>
        </div>
    );
}

export default ForgetIdOrPWD;