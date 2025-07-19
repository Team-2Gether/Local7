import React from 'react';

function AuthButton({ onClick, disabled, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`${className}1`} // 숫자 접미사 붙임
    >
      {children}
    </button>
  );
}

export default AuthButton;
