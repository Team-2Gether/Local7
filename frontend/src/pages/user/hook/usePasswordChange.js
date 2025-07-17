// src/hooks/usePasswordChange.js
import { useState } from 'react';
import axios from 'axios';

const usePasswordChange = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // 현재 비밀번호 확인
    const checkPassword = async (userId, password) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.post('/api/user/check-password', null, {
                params: { userId, password }
            });
            if (response.data.status === 'success' && response.data.isCorrect) {
                setSuccessMessage("현재 비밀번호가 확인되었습니다.");
                return true;
            } else {
                setError(response.data.message || "비밀번호가 일치하지 않습니다.");
                return false;
            }
        } catch (err) {
            console.error("비밀번호 확인 에러:", err);
            setError(err.response?.data?.message || "비밀번호 확인 중 오류가 발생했습니다.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    // 비밀번호 변경
    const changePassword = async (userId, currentPassword, newPassword) => {
        setIsLoading(true);
        setError(null);
        setSuccessMessage(null);
        try {
            const response = await axios.patch('/api/user/change-password', null, {
                params: { userId, currentPassword, newPassword }
            });
            if (response.data.status === 'success') {
                setSuccessMessage(response.data.message || "비밀번호가 성공적으로 변경되었습니다.");
                return true;
            } else {
                setError(response.data.message || "비밀번호 변경에 실패했습니다.");
                return false;
            }
        } catch (err) {
            console.error("비밀번호 변경 에러:", err);
            setError(err.response?.data?.message || "비밀번호 변경 중 오류가 발생했습니다.");
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        successMessage,
        checkPassword,
        changePassword,
        setError, // 외부에서 에러 메시지를 초기화할 수 있도록 추가
        setSuccessMessage // 외부에서 성공 메시지를 초기화할 수 있도록 추가
    };
};

export default usePasswordChange;