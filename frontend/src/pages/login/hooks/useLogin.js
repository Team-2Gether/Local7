import {useState} from 'react';
import {loginUser} from '../../../api/LoginApi';
import useFormData from '../../../common/useFormData';

function useLogin(onLoginSuccess) {
    const {formData, handleChange} = useFormData({credential: '', password: ''}); //useFormData를 사용하여 formData와 handleChange를 초기화
    const [isLoading, setIsLoading] = useState(false); // 로딩 상태 추가

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isLoading) { // 이미 로딩 중이면 요청을 보내지 않음
            return;
        }

        setIsLoading(true); // 로딩 시작

        try {
            const data = await loginUser(formData.credential, formData.password); //formData에서 credential과 password를 사용

            alert(data.message || "로그인 성공!");
            onLoginSuccess({
                userId: data.userId,
                userLoginId: data.userLoginId,
                userName: data.userName,
                userNickname: data.userNickname,
                userBio: data.userBio,
                userEmail: data.userEmail,
                ruleId: data.ruleId,
                userRule: data.userRule,
                userProfileImageUrl: data.userProfileImageUrl,
                createDate: data.createDate,
                createdId: data.createdId,
                updatedDate: data.updatedDate,
                updatedId: data.updatedId
            });
        } catch (error) {
            console.error("로그인 중 오류 발생:", error);
            if (error.response && error.response.data) {
                const errorCode = error.response.data.code;
                const errorMessage = error.response.data.message;
                if (errorCode === "user_not_found") {
                    alert("로그인 실패: 존재하지 않는 아이디/이메일입니다.");
                } else if (errorCode === "password_mismatch") {
                    alert("로그인 실패: 비밀번호가 일치하지 않습니다.");
                } else if (errorMessage) {
                    alert("로그인 실패: " + errorMessage);
                } else {
                    alert("로그인 중 오류가 발생했습니다.");
                }
            } else {
                alert("로그인 중 오류가 발생했습니다.");
            }
        } finally {
            setIsLoading(false); // 로딩 종료
        }
    };

    return {
        credential: formData.credential, //credential을 formData.credential로 변경
        setCredential: (value) => handleChange({
            target: {
                name: 'credential',
                value
            }
        }), //handleChange를 사용하여 credential 업데이트
        password: formData.password, //password를 formData.password로 변경
        setPassword: (value) => handleChange({
            target: {
                name: 'password',
                value
            }
        }), //handleChange를 사용하여 password 업데이트
        handleSubmit,
        isLoading // isLoading 상태 반환
    };
}

export default useLogin;