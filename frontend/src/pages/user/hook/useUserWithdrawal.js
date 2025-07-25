// src/user/hook/useUserWithdrawal.js
import { useState } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay'; // 경로 변경

const useUserWithdrawal = (currentUser, onLogout, withdrawalPassword, withdrawalVerificationCode, setFormData) => { // currentUser 추가
    const [withdrawalRequested, setWithdrawalRequested] = useState(false);
    const [isRequestingWithdrawalCode, setIsRequestingWithdrawalCode] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const { message: withdrawalMessage, messageType: withdrawalMessageType, displayMessage: displayWithdrawalMessage } = useMessageDisplay();

    const handleRequestWithdrawalVerification = async (e) => {
        e.preventDefault();
        if (!currentUser || !currentUser.userId) {
            displayWithdrawalMessage('로그인 정보가 없습니다.', 'error');
            return;
        }
        if (!withdrawalPassword) {
            displayWithdrawalMessage('탈퇴를 위해 현재 비밀번호를 입력해주세요.', 'error');
            return;
        }

        setIsRequestingWithdrawalCode(true);
        try {
            // 백엔드에서 @RequestParam userId를 받도록 되어 있으므로, body가 아닌 params로 보내는 것이 더 명확
            const response = await axios.post('http://192.168.0.10:8080/api/user/request-withdrawal', null, {
                params: {
                    userId: currentUser.userId
                }
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
        if (!currentUser || !currentUser.userId) {
            displayWithdrawalMessage('로그인 정보가 없습니다.', 'error');
            return;
        }
        if (!withdrawalPassword) {
            displayWithdrawalMessage('비밀번호를 입력해주세요.', 'error');
            return;
        }
        if (!withdrawalVerificationCode) {
            displayWithdrawalMessage('인증 코드를 입력해주세요.', 'error');
            return;
        }

        setIsWithdrawing(true);
        try {
            // @DeleteMapping에서 @PostMapping으로 변경되었으므로 axios.post 사용
            // 백엔드에서 @RequestParam으로 받으므로 params를 사용
            const response = await axios.post('http://192.168.0.10:8080/api/user/withdraw', null, {
                params: {
                    userId: currentUser.userId,
                    password: withdrawalPassword,
                    verificationCode: withdrawalVerificationCode
                }
            });
            if (response.data.status === 'success') {
                displayWithdrawalMessage('회원 탈퇴가 성공적으로 처리되었습니다.', 'success');
                if (onLogout) {
                    onLogout();
                } else {
                    window.location.href = '/login'; // 또는 다른 로그인 페이지 경로
                }
            } else {
                displayWithdrawalMessage(response.data.message || '회원 탈퇴에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("회원 탈퇴 중 오류 발생:", error);
            displayWithdrawalMessage(error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsWithdrawing(false);
            if (setFormData) {
                setFormData({ withdrawalPassword: '', withdrawalVerificationCode: '' });
            }
        }
    };

    return {
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