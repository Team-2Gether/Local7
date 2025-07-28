import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const OAuth2RedirectHandler = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleOAuthRedirect = async () => {
      // Google 로그인 성공 후 Spring Security가 프론트엔드로 리다이렉트하면서
      // 서버에서 세션에 로그인 정보를 이미 저장했을 가능성이 높습니다.
      // 따라서, 백엔드의 /api/auth/login/oauth2/code/google 엔드포인트를
      // 직접 호출하여 추가적인 사용자 정보 처리 및 세션 유효성을 확인합니다.
      try {
        // 백엔드의 googleLoginSuccess 엔드포인트 호출 (GET 요청)
        // 이 호출을 통해 백엔드는 OAuth2User 정보를 처리하고 세션에 저장합니다.
        const response = await axios.get("http://localhost:8080/api/auth/login/oauth2/code/google");
        
        if (response.status === 200 && response.data.isLoggedIn) {
          console.log('Google 로그인 처리 완료 및 상태 확인 성공:', response.data);
          // 로그인 성공 후 메인 페이지로 이동
          navigate('/');
        } else {
          console.error('Google 로그인 실패 또는 상태 확인 오류');
          navigate('/'); // 실패 시 로그인 페이지로 이동
        }
      } catch (error) {
        console.error('Google 로그인 처리 중 오류 발생:', error);
        navigate('/'); // 오류 발생 시 로그인 페이지로 이동
      }
    };

    handleOAuthRedirect();
  }, [navigate]); // location은 더 이상 직접적으로 사용되지 않으므로 의존성 배열에서 제거

  return (
    <div>
      <p>Google 로그인 처리 중...</p>
    </div>
  );
};

export default OAuth2RedirectHandler;