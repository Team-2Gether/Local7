// src/pages/user/components/UserIMGSection.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import useMessageDisplay from '../hook/useMessageDisplay';
import { FaUserCircle } from 'react-icons/fa';

function UserIMGSection({ currentUser, onLogout }) {
    const { message, messageType, displayMessage } = useMessageDisplay();

    const [selectedFile, setSelectedFile] = useState(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(currentUser?.userProfileImageUrl || '');

    useEffect(() => {
        setPreviewImageUrl(currentUser?.userProfileImageUrl || '');
    }, [currentUser]);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImageUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setSelectedFile(null);
            setPreviewImageUrl(currentUser?.userProfileImageUrl || '');
        }
    };

    const handleImageUpdate = async () => {
        if (!selectedFile) {
            displayMessage('변경할 이미지를 선택해주세요.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedFile);
        reader.onloadend = async () => {
            const base64Image = reader.result; // "data:image/jpeg;base64,..." 형태의 문자열

            try {
                // `params` 대신 직접 JSON 객체를 요청 본문으로 전달
                const response = await axios.post('http://localhost:8080/api/user/update-profile-image', {
                    userId: currentUser.userId,
                    userProfileImageUrl: base64Image
                });

                if (response.data.status === 'success') {
                    displayMessage('프로필 이미지가 성공적으로 변경되었습니다.', 'success');
                    if (onLogout) {
                        onLogout();
                    }
                } else {
                    displayMessage(response.data.message || '프로필 이미지 변경에 실패했습니다.', 'error');
                }
            } catch (error) {
                console.error('프로필 이미지 변경 오류:', error);
                if (error.response && error.response.data && error.response.data.message) {
                    displayMessage(error.response.data.message, 'error');
                } else {
                    displayMessage('서버 오류가 발생했습니다. 프로필 이미지를 변경할 수 없습니다.', 'error');
                }
            }
        };
    };

    return (
        <div className="user-section">
            <h3><FaUserCircle /> 프로필 이미지 변경</h3>
            {message && (
                <div className={`message ${messageType === 'success' ? 'success' : 'error'}`}>
                    {message}
                </div>
            )}
            <div className="profile-image-container">
                {previewImageUrl ? (
                    <img src={previewImageUrl} alt="프로필 미리보기" className="profile-preview-image" />
                ) : (
                    <div className="profile-placeholder-image">
                        <FaUserCircle size={100} color="#ccc" />
                        <p>이미지 없음</p>
                    </div>
                )}
            </div>
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button onClick={handleImageUpdate} disabled={!selectedFile}>
                이미지 변경
            </button>
        </div>
    );
}

export default UserIMGSection;