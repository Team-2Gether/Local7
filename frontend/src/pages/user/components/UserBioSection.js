// src/pages/user/components/UserBioSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSignature } from 'react-icons/fa';
import useMessageDisplay from '../hook/useMessageDisplay';

function UserBioSection({ currentUser, onUserUpdate }) { // onUserUpdate prop 추가
    const [userBio, setUserBio] = useState('');
    const { message, messageType, displayMessage } = useMessageDisplay();
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (currentUser && currentUser.userBio) {
            setUserBio(currentUser.userBio);
        } else {
            setUserBio(''); // currentUser.userBio가 없는 경우 빈 문자열로 초기화
        }
    }, [currentUser]);

    const handleUpdateBio = async () => {
        if (!currentUser || !currentUser.userId) {
            displayMessage('로그인 정보가 없습니다.', 'error');
            return;
        }

        try {
            const response = await axios.post('http://192.168.0.10:8080/api/user/update-bio', null, {
                params: {
                    userId: currentUser.userId,
                    userBio: userBio
                }
            });
            if (response.data.status === 'success') {
                displayMessage('자기소개가 성공적으로 업데이트되었습니다.', 'success');
                setIsEditing(false); // 수정 모드 종료
                // onUserUpdate를 통해 부모 컴포넌트의 currentUser 상태 업데이트
                if (onUserUpdate) {
                    onUserUpdate({ userBio: userBio });
                }
            } else {
                displayMessage(response.data.message || '자기소개 업데이트에 실패했습니다.', 'error');
            }
        } catch (error) {
            console.error('자기소개 업데이트 오류:', error);
            if (error.response && error.response.data && error.response.data.message) {
                displayMessage(error.response.data.message, 'error');
            } else {
                displayMessage('자기소개 업데이트 중 오류가 발생했습니다.', 'error');
            }
        }
    };

    const handleCancelEdit = () => {
        setUserBio(currentUser.userBio || ''); // 기존 자기소개로 되돌리기
        setIsEditing(false);
    };

    return (
        <div className="user-section">
            <h3 className="user-section-title">
                <FaSignature className="section-icon" /> 프로필 소개
            </h3>
            <div className="user-section-content">
                {isEditing ? (
                    <div className="form-group">
                        <textarea
                            className="form-control"
                            value={userBio}
                            onChange={(e) => setUserBio(e.target.value)}
                            rows="4"
                            maxLength="500"
                            placeholder="자기소개를 입력하세요 (최대 500자)"
                        ></textarea>
                        <div className="button-group">
                            <button onClick={handleUpdateBio} className="btn btn-primary">저장</button>
                            <button onClick={handleCancelEdit} className="btn btn-secondary">취소</button>
                        </div>
                    </div>
                ) : (
                    <div className="current-info">
                        <p className="info-display">
                            {userBio ? userBio : '아직 자기소개가 없습니다.'}
                        </p>
                        <button onClick={() => setIsEditing(true)} className="btn btn-edit">수정</button>
                    </div>
                )}
                {message && (
                    <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                        {message}
                    </div>
                )}
            </div>
        </div>
    );
}

export default UserBioSection;