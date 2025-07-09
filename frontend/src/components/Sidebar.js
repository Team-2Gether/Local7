import React from 'react';
import {FaHome, FaPlus, FaUser, FaRobot} from 'react-icons/fa'; // 아이콘 임포트
import { useNavigate } from 'react-router-dom';
import '../assets/css/Sidebar.css'; // Sidebar.css 임포트 추가

const Sidebar = ({onMenuItemClick}) => {
    
    const navigate = useNavigate();

    const handleAddClick = () => {
        navigate('/posts/new'); 
    };



    return (
        <div className="sidebar-container">
            {/* style 대신 className 사용 */}
            <button className="sidebar-button"
                // style, onMouseEnter, onMouseLeave 제거, className 사용
                onClick={() => onMenuItemClick('home')}>
                <FaHome className="sidebar-icon"/> {/* style 대신 className 사용 */}
                <span>홈</span>
            </button>
            <button className="sidebar-button"
                // style, onMouseEnter, onMouseLeave 제거, className 사용
                onClick={(handleAddClick)}>
                <FaPlus className="sidebar-icon"/> {/* style 대신 className 사용 */}
                <span>추가</span>
            </button>
            <button className="sidebar-button"
                // style, onMouseEnter, onMouseLeave 제거, className 사용
                onClick={() => onMenuItemClick('mypage')}>
                <FaUser className="sidebar-icon"/> {/* style 대신 className 사용 */}
                <span>마이</span>
            </button>
            <button className="sidebar-button"
                // style, onMouseEnter, onMouseLeave 제거, className 사용
                onClick={() => onMenuItemClick('ai')}>
                <FaRobot className="sidebar-icon"/> {/* style 대신 className 사용 */}
                <span>AI</span>
            </button>
        </div>
    );
};

export default Sidebar;