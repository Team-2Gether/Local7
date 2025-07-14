// src/user/hook/useUserLoginId.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay'; // 경로 변경

const useUserLoginId = (currentUser, onLogout) => {
    const [newUserLoginId, setNewUserLoginId] = useState('');
    const [isLoginIdChecked, setIsLoginIdChecked] = useState(false);
    const [isLoginIdAvailable, setIsLoginIdAvailable] = useState(false);
    const [isCheckingLoginId, setIsCheckingLoginId] = useState(false);
    const [isUpdatingLoginId, setIsUpdatingLoginId] = useState(false);

    const { message: loginIdMessage, messageType: loginIdMessageType, displayMessage: displayLoginIdMessage } = useMessageDisplay();

    useEffect(() => {
        if (currentUser) {
            setNewUserLoginId(currentUser.userLoginId || '');
            setIsLoginIdChecked(false);
            setIsLoginIdAvailable(false);
            displayLoginIdMessage('', '');
        }
    }, [currentUser, displayLoginIdMessage]);

    const handleLoginIdChange = (e) => {
        setNewUserLoginId(e.target.value);
        setIsLoginIdChecked(false);
        setIsLoginIdAvailable(false);
        displayLoginIdMessage('', '');
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
            console.error("아이디 변경 중 오류 발생:", error);
            displayLoginIdMessage(error.response?.data?.message || '아이디 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingLoginId(false);
        }
    };

    return {
        newUserLoginId,
        handleLoginIdChange,
        handleCheckLoginId,
        handleUpdateLoginId,
        isLoginIdChecked,
        isLoginIdAvailable,
        isCheckingLoginId,
        isUpdatingLoginId,
        loginIdMessage,
        loginIdMessageType
    };
};

export default useUserLoginId;