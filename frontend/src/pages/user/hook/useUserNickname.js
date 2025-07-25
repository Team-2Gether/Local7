// src/pages/user/hook/useUserNickname.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay'; // 경로 변경

const useUserNickname = (currentUser, onUserUpdate) => { // onLogout 대신 onUserUpdate 인자로 받음
    const [newUserNickname, setNewUserNickname] = useState('');
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);
    const [isNicknameAvailable, setIsNicknameAvailable] = useState(false);
    const [isCheckingNickname, setIsCheckingNickname] = useState(false);
    const [isUpdatingNickname, setIsUpdatingNickname] = useState(false);

    const { message: nicknameMessage, messageType: nicknameMessageType, displayMessage: displayNicknameMessage } = useMessageDisplay();

    useEffect(() => {
        if (currentUser) {
            setNewUserNickname(currentUser.userNickname || '');
            setIsNicknameChecked(false);
            setIsNicknameAvailable(false);
            displayNicknameMessage('', '');
        }
    }, [currentUser, displayNicknameMessage]);

    const handleNicknameChange = (e) => {
        setNewUserNickname(e.target.value);
        setIsNicknameChecked(false);
        setIsNicknameAvailable(false);
        displayNicknameMessage('', '');
    };

    const handleCheckNickname = async () => {
        if (!newUserNickname.trim()) {
            displayNicknameMessage('새 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (currentUser && newUserNickname === currentUser.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.', 'warning');
            setIsNicknameChecked(true);
            setIsNicknameAvailable(false);
            return;
        }

        setIsCheckingNickname(true);
        try {
            const response = await axios.get(`http://192.168.0.10:8080/api/user/check-nickname?userNickname=${newUserNickname}`);
            if (response.data.status === 'success') {
                setIsNicknameChecked(true);
                setIsNicknameAvailable(!response.data.isDuplicate);
                displayNicknameMessage(response.data.message, response.data.isDuplicate ? 'error' : 'success');
            } else {
                displayNicknameMessage(response.data.message || '닉네임 중복 확인에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("닉네임 중복 확인 중 오류 발생:", error);
            displayNicknameMessage(error.response?.data?.message || '닉네임 중복 확인 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsCheckingNickname(false);
        }
    };

    const handleUpdateNickname = async () => {
        if (!currentUser || !currentUser.userId) {
            displayNicknameMessage('로그인 정보가 없습니다.', 'error');
            return;
        }
        if (!newUserNickname.trim()) {
            displayNicknameMessage('새 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (!isNicknameChecked || !isNicknameAvailable) {
            displayNicknameMessage('먼저 닉네임 중복 확인을 완료하고 사용 가능한 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (newUserNickname === currentUser.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 변경하려면 다른 닉네임을 입력해주세요.', 'error');
            return;
        }

        setIsUpdatingNickname(true);
        try {
            const response = await axios.post('http://192.168.0.10:8080/api/user/update-nickname', null, {
                params: {
                    userId: currentUser.userId,
                    newUserNickname: newUserNickname
                }
            });
            if (response.status === 200 && response.data.status === 'success') {
                displayNicknameMessage('닉네임이 성공적으로 변경되었습니다.', 'success'); // 즉시 반영되므로 "다시 로그인해야 적용됩니다" 메시지 삭제
                setIsNicknameChecked(false);
                setIsNicknameAvailable(false);
                if (onUserUpdate) { // onUserUpdate가 존재하면 호출
                    onUserUpdate({ userNickname: newUserNickname });
                }
            } else {
                displayNicknameMessage(response.data.message || '닉네임 변경에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error("닉네임 변경 중 오류 발생:", error);
            displayNicknameMessage(error.response?.data?.message || '닉네임 변경 중 오류가 발생했습니다.', 'error');
        } finally {
            setIsUpdatingNickname(false);
        }
    };

    return {
        newUserNickname,
        handleNicknameChange,
        handleCheckNickname,
        handleUpdateNickname,
        isNicknameChecked,
        isNicknameAvailable,
        isCheckingNickname,
        isUpdatingNickname,
        nicknameMessage,
        nicknameMessageType
    };
};

export default useUserNickname;