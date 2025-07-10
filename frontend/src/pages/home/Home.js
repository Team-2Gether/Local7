import React from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../components/Sidebar'; 

function Home({ currentUser }) {
    const navigate = useNavigate();

    const handleMenuItemClick = (menuItem) => {
        console.log(`${menuItem} 메뉴 클릭됨`);
        if (menuItem === 'home') {
            navigate('/');
        } else if (menuItem === 'pick') {
        }
        else if (menuItem === 'posts') { 
            navigate('/posts');
        } else if (menuItem === 'mypage') {
        } else if (menuItem === 'ai') {
        } 
    };

    return (
        <div className="main-content-area">
            
            <Sidebar onMenuItemClick={handleMenuItemClick} />

            
            <div className="page-content">
                
                {/* 여기서 작업 하면 됨 */}
                
            </div>
        </div>
    );
}

export default Home;
