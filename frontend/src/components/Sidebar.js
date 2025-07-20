import React from 'react';
import {FaHome, FaUser, FaRobot, FaAward, FaBullhorn} from 'react-icons/fa';
import {RiAdminLine} from 'react-icons/ri';
import { useNavigate } from 'react-router-dom'; 

const Sidebar = ({ onMenuItemClick, currentUser }) => {
    const navigate = useNavigate(); 

    const handleSidebarClick = (item) => {
        if (item === "ai") {
            onMenuItemClick(item); 
        } else {
            
            onMenuItemClick(item); 
            
            // 라우팅 처리
            if (item === "home")
                navigate("/");
            else if (item === "restaurants")
                navigate("/restaurants");
            else if (item === "posts")
                navigate("/posts");
            else if (item === "add")
                navigate("/posts/new");
            else if (item === "mypage")
                navigate("/mypage");
            else if (item === "pick")
                navigate("/pick");
            else if (item === "notice")
                navigate("/notice");
            else if (item === 'ai')
                navigate("/ai");
            else if (item === 'admin')
                navigate("/admin"); 
        }
    };

    return (
        <div className="sidebar-container">
            <button className="sidebar-button" onClick={() => handleSidebarClick('home')}>
                <FaHome className="sidebar-icon"/>
                <span>홈</span>
            </button>

            {/* pick 버튼: 이달의 여행지 순위 투표 */}
            <button className="sidebar-button" onClick={() => handleSidebarClick('pick')}>
                <FaAward className="sidebar-icon"/>
                <span>TOP10</span>
            </button>

            {/*
            <button className="sidebar-button" onClick={() => handleSidebarClick('restaurants')}>
                <FaUtensils className="sidebar-icon" />
                <span>주변 맛집</span>
            </button>
            */}

            {/* <button className="sidebar-button" onClick={() => handleSidebarClick('posts')}>
                <FaListAlt className="sidebar-icon"/>
                <span>스레드</span>
            </button> */}

            <button className="sidebar-button" onClick={() => handleSidebarClick('mypage')}>
                <FaUser className="sidebar-icon"/>
                <span>마이</span>
            </button>

            <button className="sidebar-button" onClick={() => handleSidebarClick('notice')}>
                <FaBullhorn className="sidebar-icon"/>
                <span>공지/문의</span>
            </button>

            <button className="sidebar-button" onClick={() => handleSidebarClick('ai')}>
                <FaRobot className="sidebar-icon"/>
                <span>7봇</span>
            </button>

            {currentUser && currentUser.ruleId === 1 && (
                <button className="sidebar-button" onClick={() => handleSidebarClick('admin')}>
                    <RiAdminLine className="sidebar-icon"/>
                    <span>관리자</span>
                </button>
            )}

        </div>
    );
};

export default Sidebar;