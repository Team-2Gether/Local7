import React from 'react';
import { FaHome, FaPlus, FaUser, FaRobot } from 'react-icons/fa'; // 아이콘 임포트 (npm install react-icons 필요)

const Sidebar = ({ onMenuItemClick }) => {
    const iconStyle = {
        fontSize: '24px',
        marginBottom: '5px'
    };

    const buttonStyle = {
        background: 'none',
        border: 'none',
        color: 'white',
        padding: '15px 0',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        borderRadius: '5px'
    };

    const buttonHoverStyle = {
        backgroundColor: '#575757' // 호버 시 배경색
    };

    return (
        <div style={{
            width: '80px', // 사이드바 너비
            backgroundColor: '#333', // 배경색
            color: 'white',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '20px 0',
            boxShadow: '2px 0 5px rgba(0,0,0,0.2)'
        }}>
            <button
                style={buttonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.background}
                onClick={() => onMenuItemClick('home')}
            >
                <FaHome style={iconStyle} />
                <span>홈</span>
            </button>
            <button
                style={buttonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.background}
                onClick={() => onMenuItemClick('add')}
            >
                <FaPlus style={iconStyle} />
                <span>추가</span>
            </button>
            <button
                style={buttonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.background}
                onClick={() => onMenuItemClick('mypage')}
            >
                <FaUser style={iconStyle} />
                <span>마이</span>
            </button>
            <button
                style={buttonStyle}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = buttonStyle.background}
                onClick={() => onMenuItemClick('ai')}
            >
                <FaRobot style={iconStyle} />
                <span>AI</span>
            </button>
        </div>
    );
};

export default Sidebar;