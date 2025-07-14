// src/user/hook/useUserPassword.js
import { useState } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay'; // 경로 변경

const useUserPassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPasswordFields, setShowNewPasswordFields] = useState(false);
    const [isResettingPassword, setIsResettingPassword] = useState(false);

    const { message: passwordMessage, messageType: passwordMessageType, displayMessage: displayPasswordMessage } = useMessageDisplay();

    const handleConfirmCurrentPassword = (e) => {
        e.preventDefault();
        if (!currentPassword) {
            displayPasswordMessage('현재 비밀번호를 입력해주세요.', 'error');
            return;
        }
        setShowNewPasswordFields(true);
        displayPasswordMessage('', '');
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            displayPasswordMessage('새 비밀번호와 비밀번호 확인이 일치하지 않습니다.', 'error');
            return;
        }
        if (!currentPassword || !newPassword) {
            displayPasswordMessage('현재 비밀번호와 새 비밀번호를 모두 입력해주세요.', 'error');
            return;
        }

        setIsResettingPassword(true);
        try {
            const response = await axios.post('http://localhost:8080/api/user/reset-password', { currentPassword, newPassword });
            if (response.data.status === 'success') {
                displayPasswordMessage(response.data.message, 'success');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
                setShowNewPasswordFields(false);
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

    return {
        currentPassword,
        setCurrentPassword,
        newPassword,
        setNewPassword,
        confirmPassword,
        setConfirmPassword,
        showNewPasswordFields,
        handleConfirmCurrentPassword,
        handleResetPassword,
        isResettingPassword,
        passwordMessage,
        passwordMessageType
    };
};

export default useUserPassword;