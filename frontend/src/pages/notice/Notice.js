import React from 'react';
import Navbar from '../../components/Navbar'; 
import Sidebar from '../../components/Sidebar'; 
import { useNavigate } from 'react-router-dom'; 

function Notice({ currentUser }) {
    const navigate = useNavigate();

    const handleSidebarClick = (item) => {
        if (item === 'home') navigate('/');
        else if (item === 'restaurants') navigate('/restaurants');
        else if (item === 'posts') navigate('/posts');
        else if (item === 'add') navigate('/posts/new');
        else if (item === 'mypage') navigate('/mypage');
        else if (item === 'pick') navigate('/pick');
        else if (item === 'notice') navigate('/notice'); 
        
    };

    return (
        <div className="app-layout">
            {/* Navbar는 항상 상단에 표시 */}
            <div className="navbar-container">
                <Navbar isLoggedIn={true} userNickname={currentUser?.userNickname} onLogout={() => { /* 로그아웃 로직 */ }} />
            </div>

            <div className="main-content-area">
                {/* Sidebar는 왼쪽에 표시 */}
                <div className="sidebar-container">
                    <Sidebar onMenuItemClick={handleSidebarClick} />
                </div>

                {/* 공지사항 내용이 표시될 메인 컨텐츠 영역 */}
                
                
            </div>
        </div>
    );
}

export default Notice;
