// src/pages/user/components/UserNicknameSection.js
import React from 'react';
import useUserNickname from '../hook/useUserNickname'; // 경로 변경

function UserNicknameSection({ currentUser, onLogout, onUserUpdate }) { // onUserUpdate prop 추가
    const {
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
    } = useUserNickname(currentUser, onUserUpdate); // onLogout 대신 onUserUpdate 전달

    return (
        <div className="user-update-form">
            <h3>닉네임 변경</h3>
            <div className="form-group">
                <label htmlFor="userNickname">현재 닉네임:</label>
                <input type="text" id="userNickname" value={currentUser?.userNickname || ''} disabled />
            </div>
            <div className="form-group">
                <label htmlFor="newUserNickname">새 닉네임:</label>
                <div className="input-with-button">
                    <input
                        type="text"
                        id="newUserNickname"
                        value={newUserNickname}
                        onChange={handleNicknameChange}
                        placeholder="새 닉네임을 입력하세요"
                        disabled={isCheckingNickname || isUpdatingNickname}
                    />
                    <button
                        className="check-button"
                        onClick={handleCheckNickname}
                        disabled={isCheckingNickname || isUpdatingNickname}
                    >
                        {isCheckingNickname ? '확인 중...' : '중복 확인'}
                    </button>
                </div>
                {nicknameMessage && (
                    <div className={`message ${nicknameMessageType === 'success' ? 'success' : 'error'}`}>
                        {nicknameMessage}
                    </div>
                )}
            </div>
            <button
                className="submit-button"
                onClick={handleUpdateNickname}
                disabled={!isNicknameChecked || !isNicknameAvailable || isUpdatingNickname || isCheckingNickname || newUserNickname === currentUser?.userNickname}
            >
                {isUpdatingNickname ? '변경 중...' : '닉네임 변경'}
            </button>
        </div>
    );
}

export default UserNicknameSection;