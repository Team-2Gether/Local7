import React from 'react';
import {FaHome, FaUser, FaRobot, FaAward, FaListAlt, FaUtensils, FaBullhorn} from 'react-icons/fa';

const Sidebar = ({onMenuItemClick}) => {

    return (
        <div className="sidebar-container">
            <button className="sidebar-button" onClick={() => onMenuItemClick('home')}>
                <FaHome className="sidebar-icon"/>
                <span>홈</span>
            </button>

            {/* pick 버튼: 이달의 여행지 순위 투표 */}
            <button className="sidebar-button" onClick={() => onMenuItemClick('pick')}>
                <FaAward className="sidebar-icon"/>
                <span>TOP10</span>
            </button>

            <button className="sidebar-button" onClick={() => onMenuItemClick('restaurants')}>
                <FaUtensils className="sidebar-icon" />
                <span>음식점</span>
            </button>

            <button className="sidebar-button" onClick={() => onMenuItemClick('posts')}>
                <FaListAlt className="sidebar-icon"/>
                <span>게시글</span>
            </button>

            <button className="sidebar-button" onClick={() => onMenuItemClick('mypage')}>
                <FaUser className="sidebar-icon"/>
                <span>마이</span>
            </button>
            <button className="sidebar-button" onClick={() => onMenuItemClick('ai')}>
                <FaRobot className="sidebar-icon"/>
                <span>AI</span>
            </button>

            <button className="sidebar-button" onClick={() => onMenuItemClick('notice')}>
                <FaBullhorn className="sidebar-icon"/>
                <span>공지사항</span>
            </button>

        </div>
    );
};

export default Sidebar;
