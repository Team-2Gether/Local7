import React from 'react';
import {FaHome, FaUser, FaAward, FaBullhorn, FaRobot} from 'react-icons/fa';
import { FaUserPlus } from "react-icons/fa6";
import {RiAdminLine} from 'react-icons/ri';
import { useNavigate, Link } from 'react-router-dom'; 

const Sidebar = ({ onMenuItemClick, currentUser }) => {
    const navigate = useNavigate(); 

    return (
        <div className="sidebar-container">
            <Link to="/" className="sidebar-button" >
                <FaHome className="sidebar-icon"/>
                <span>홈</span>
            </Link>

            {/* pick 버튼: 이달의 여행지 순위 투표 */}
            <Link to="/pick" className="sidebar-button" >
                <FaAward className="sidebar-icon"/>
                <span>TOP10</span>
            </Link>

            {/*
            <button className="sidebar-button" onClick={() => onMenuItemClick('restaurants')}>
                <FaUtensils className="sidebar-icon" />
                <span>주변 맛집</span>
            </button>
            */}

            {/* <button className="sidebar-button" onClick={() => onMenuItemClick('posts')}>
                <FaListAlt className="sidebar-icon"/>
                <span>스레드</span>
            </button> */}

            <Link to="/mypage" className="sidebar-button" >
                <FaUser className="sidebar-icon"/>
                <span>마이</span>
            </Link>

            <Link to="/search-user" className="sidebar-button" >
                <FaUserPlus className="sidebar-icon"/>
                <span>유저 검색</span>
            </Link>

            <Link to="/notice" className="sidebar-button" >
                <FaBullhorn className="sidebar-icon"/>
                <span>공지/문의</span>
            </Link>

            {/* AI 버튼은 모달이므로 Link 대신 Button 유지 */}
            <button className="sidebar-button" onClick={() => onMenuItemClick('ai')}>
                <FaRobot className="sidebar-icon"/>
                <span>R7봇</span>
            </button>

            {currentUser && currentUser.ruleId === 1 && (
                <Link to="/admin" className="sidebar-button" >
                    <RiAdminLine className="sidebar-icon"/>
                    <span>관리자</span>
                </Link>
            )}

        </div>
    );
};

export default Sidebar;