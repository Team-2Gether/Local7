// src/user/hook/useUserLoginId.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay';

const useUserLoginId = (currentUser, onLogout) => {
    const [newUserLoginId, setNewUserLoginId] = useState('');
    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);
    const [isCheckingLoginId, setIsCheckingLoginId] = useState(false);
    const [isRequestingVerification, setIsRequestingVerification] = useState(false); // 인증 코드 요청 중 상태
    const [isVerificationRequested, setIsVerificationRequested] = useState(false); // 인증 코드 요청 완료 상태
    const [verificationCode, setVerificationCode] = useState(''); // 인증 코드 입력 상태
    const [isConfirmingLoginId, setIsConfirmingLoginId] = useState(false); // 아이디 변경 확정 중 상태

    const { message: loginIdMessage, messageType: loginIdMessageType, displayMessage: displayLoginIdMessage } = useMessageDisplay();

    useEffect(() => {
        if (currentUser) {
            setNewUserLoginId(currentUser.userLoginId || '');
            setIsLoginIdChecked(false);
            setIsLoginIdAvailable(false);
            setIsVerificationRequested(false); // 초기화
            setVerificationCode(''); // 초기화
            displayLoginIdMessage('', '');
        }
    }, [currentUser, displayLoginIdMessage]);

    const handleLoginIdChange = (e) => {
        setNewUserLoginId(e.target.value);
        setIsLoginIdChecked(false);
        setIsLoginIdAvailable(false);
        setIsVerificationRequested(false); // 새 아이디 입력 시 인증 상태 초기화
        setVerificationCode(''); // 인증 코드 초기화
        displayLoginIdMessage('', '');
    };

    const handleVerificationCodeChange = (e) => {
        setVerificationCode(e.target.value);
        displayLoginIdMessage('', ''); // 메시지 초기화
    };

    const handleCheckLoginId = async () => {
        if (!newUserLoginId.trim()) {
            displayLoginIdMessage('새 아이디를 입력해주세요.', 'error');
            return;
        }
        if (currentUser && newUserLoginId === currentUser.userLoginId) {
            displayLoginIdMessage('현재 아이디와 동일합니다. 다른 아이디를 입력해주세요.', 'warning');
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
            }
        } catch (error) {
            console.error("아이디 중복 확인 중 오류 발생:", error);
            displayLoginIdMessage(error.response?.data?.message || '아이디 중복 확인 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsCheckingLoginId(false);
        }
    };

    const handleRequestLoginIdChangeVerification = async () => {
        if (!currentUser || !currentUser.userId) {
            displayLoginIdMessage('로그인 정보가 없습니다.', 'error');
            return;
        }
        if (!newUserLoginId.trim()) {
            displayLoginIdMessage('새 아이디를 입력해주세요.', 'error');
            return;
        }
        if (!isLoginIdChecked || !isLoginIdAvailable) {
            displayLoginIdMessage('먼저 아이디 중복 확인을 완료하고 사용 가능한 아이디를 입력해주세요.', 'error');
            return;
        }
        if (newUserLoginId === currentUser.userLoginId) {
            displayLoginIdMessage('현재 아이디와 동일합니다. 변경하려면 다른 아이디를 입력해주세요.', 'error');
            return;
        }

        setIsRequestingVerification(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/request-loginid-change-verification', null, {
                params: {
                    userId: currentUser.userId,
                    newUserLoginId: newUserLoginId
                }
            });
            if (response.status === 200 && response.data.status === 'success') {
                setIsVerificationRequested(true);
                displayLoginIdMessage(response.data.message, 'success');
            } else {
                displayLoginIdMessage(response.data.message || '인증 코드 발송에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("아이디 변경 인증 코드 요청 중 오류 발생:", error);
            displayLoginIdMessage(error.response?.data?.message || '인증 코드 발송 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsRequestingVerification(false);
        }
    };

    const handleConfirmLoginIdChange = async () => {
        if (!currentUser || !currentUser.userId) {
            displayLoginIdMessage('로그인 정보가 없습니다.', 'error');
            return;
        }
        if (!newUserLoginId.trim()) {
            displayLoginIdMessage('새 아이디를 입력해주세요.', 'error');
            return;
        }
        if (!isLoginIdChecked || !isLoginIdAvailable) {
            displayLoginIdMessage('먼저 아이디 중복 확인을 완료하고 사용 가능한 아이디를 입력해주세요.', 'error');
            return;
        }
        if (newUserLoginId === currentUser.userLoginId) {
            displayLoginIdMessage('현재 아이디와 동일합니다. 변경하려면 다른 아이디를 입력해주세요.', 'error');
            return;
        }
        if (!isVerificationRequested) {
            displayLoginIdMessage('먼저 인증 코드 요청을 해주세요.', 'error');
            return;
        }
        if (!verificationCode.trim()) {
            displayLoginIdMessage('인증 코드를 입력해주세요.', 'error');
            return;
        }

        setIsConfirmingLoginId(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/confirm-loginid-change', null, {
                params: {
                    userId: currentUser.userId,
                    newUserLoginId: newUserLoginId,
                    verificationCode: verificationCode
                }
            });
            if (response.status === 200 && response.data.status === 'success') {
                displayLoginIdMessage('아이디가 성공적으로 변경되었습니다. 다시 로그인해야 적용됩니다.', 'success');
                if (onLogout) {
                    onLogout();
                } else {
                    window.location.reload();
                }
            } else {
                displayLoginIdMessage(response.data.message || '아이디 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("아이디 변경 확정 중 오류 발생:", error);
            displayLoginIdMessage(error.response?.data?.message || '아이디 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsConfirmingLoginId(false);
        }
    };

    return {
        newUserLoginId,
        handleLoginIdChange,
        handleCheckLoginId,
        handleRequestLoginIdChangeVerification,
        handleConfirmLoginIdChange,
        isLoginIdChecked,
        isLoginIdAvailable,
        isCheckingLoginId,
        isRequestingVerification,
        isVerificationRequested,
        verificationCode,
        handleVerificationCodeChange,
        isConfirmingLoginId,
        loginIdMessage,
        loginIdMessageType
    };
};

export default useUserLoginId;