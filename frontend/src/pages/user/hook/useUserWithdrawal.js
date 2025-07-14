// src/user/hook/useUserWithdrawal.js
import { useState } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay'; // 경로 변경

const useUserWithdrawal = (onLogout, withdrawalPassword, withdrawalVerificationCode, setFormData) => { // 변경된 부분
    const [withdrawalRequested, setWithdrawalRequested] = useState(false);
    const [isRequestingWithdrawalCode, setIsRequestingWithdrawalCode] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const { message: withdrawalMessage, messageType: withdrawalMessageType, displayMessage: displayWithdrawalMessage } = useMessageDisplay();

    const handleRequestWithdrawalVerification = async (e) => {
        e.preventDefault();
        if (!withdrawalPassword) {
            displayWithdrawalMessage('탈퇴를 위해 현재 비밀번호를 입력해주세요.', 'error');
            return;
        }

        setIsRequestingWithdrawalCode(true);
        try {
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

    const handleWithdrawal = async (e) => {
        e.preventDefault();
        if (!withdrawalPassword || !withdrawalVerificationCode) {
            displayWithdrawalMessage('비밀번호와 인증 코드를 모두 입력해주세요.', 'error');
            return;
        }

        setIsWithdrawing(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/withdraw', {
                password: withdrawalPassword,
                verificationCode: withdrawalVerificationCode
            });
            if (response.data.status === 'success') {
                displayWithdrawalMessage('회원 탈퇴가 성공적으로 처리되었습니다.', 'success');
                if (onLogout) {
                    onLogout();
                } else {
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
            // 탈퇴 성공 또는 실패 후 폼 데이터 초기화 (선택 사항)
            if (setFormData) {
                setFormData({ withdrawalPassword: '', withdrawalVerificationCode: '' });
            }
        }
    };

    return {
        // withdrawalPassword, // 이제 props로 받으므로 불필요
        // setWithdrawalPassword, // 이제 props로 받으므로 불필요
        // withdrawalVerificationCode, // 이제 props로 받으므로 불필요
        // setWithdrawalVerificationCode, // 이제 props로 받으므로 불필요
        withdrawalRequested,
        handleRequestWithdrawalVerification,
        handleWithdrawal,
        isRequestingWithdrawalCode,
        isWithdrawing,
        withdrawalMessage,
        withdrawalMessageType
    };
};

export default useUserWithdrawal;