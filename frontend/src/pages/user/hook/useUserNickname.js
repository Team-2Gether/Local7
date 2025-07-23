// src/user/hook/useUserNickname.js
import { useState, useEffect } from 'react';
import axios from 'axios';
import useMessageDisplay from './useMessageDisplay';

// onLogout 제거, setCurrentUser 함수를 인자로 받음
const useUserNickname = (currentUser, setCurrentUser) => {
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
            displayNicknameMessage('현재 닉네임과 동일합니다.', 'info');
            setIsNicknameChecked(true);
            setIsNicknameAvailable(true);
            return;
        }

        setIsCheckingNickname(true);
        try {
            const response = await axios.get('http://localhost:8080/api/user/check-nickname', {
                params: { userNickname: newUserNickname }
            });
            if (response.data.status === 'success') {
                displayNicknameMessage('사용 가능한 닉네임입니다.', 'success');
                setIsNicknameChecked(true);
                setIsNicknameAvailable(true);
            } else {
                displayNicknameMessage(response.data.message || '닉네임 중복 확인에 실패했습니다.', 'error');
                setIsNicknameChecked(true);
                setIsNicknameAvailable(false);
            }
        } catch (error) {
            console.error("닉네임 중복 확인 중 오류 발생:", error);
            displayNicknameMessage(error.response?.data?.message || '닉네임 중복 확인 중 오류가 발생했습니다.', 'error');
            setIsNicknameChecked(false);
            setIsNicknameAvailable(false);
        } finally {
            setIsCheckingNickname(false);
        }
    };

    const handleUpdateNickname = async () => {
        if (!newUserNickname.trim()) {
            displayNicknameMessage('새 닉네임을 입력해주세요.', 'error');
            return;
        }
        if (!isNicknameChecked || !isNicknameAvailable) {
            displayNicknameMessage('닉네임 중복 확인을 해주세요.', 'error');
            return;
        }
        if (newUserNickname === currentUser?.userNickname) {
            displayNicknameMessage('현재 닉네임과 동일합니다. 다른 닉네임을 입력해주세요.', 'info');
            return;
        }
        if (!currentUser || !currentUser.userId) {
            displayNicknameMessage('로그인 정보가 없습니다.', 'error');
            return;
        }

        setIsUpdatingNickname(true);
        try {
            // Spring Boot @GetMapping에서 @PostMapping으로 변경되었으므로 axios.post 사용
            // 백엔드에서 @RequestParam으로 받으므로 params를 사용
            const response = await axios.post('http://localhost:8080/api/user/update-nickname', null, {
                params: {
                    userId: currentUser.userId,
                    newUserNickname: newUserNickname
                }
            });
            if (response.status === 200 && response.data.status === 'success') {
                displayNicknameMessage('닉네임이 성공적으로 변경되었습니다.', 'success');
                setIsNicknameChecked(false);
                setIsNicknameAvailable(false);

                // currentUser 객체 업데이트 및 부모 컴포넌트에 전달
                const updatedUser = { ...currentUser, userNickname: newUserNickname };
                // sessionStorage.setItem('currentUser', JSON.stringify(updatedUser)); // UserPage에서 일괄 처리
                setCurrentUser(updatedUser); // 부모 컴포넌트의 상태 업데이트
                setNewUserNickname(newUserNickname); // 입력 필드도 업데이트된 닉네임으로 유지
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