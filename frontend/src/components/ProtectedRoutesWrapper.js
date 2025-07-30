// src/components/ProtectedRoutesWrapper.js
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutesWrapper({ isLoggedIn }) {
    if (!isLoggedIn) {
        // 로그인되어 있지 않으면 /forbidden 페이지로 리다이렉트
        return <Navigate to="/forbidden" replace />;
    }
    return <Outlet />;
}

export default ProtectedRoutesWrapper;