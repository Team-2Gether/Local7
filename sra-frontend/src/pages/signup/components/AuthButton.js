import React from 'react';

function AuthButton({ onClick, disabled, children, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={className}
    >
      {children}
    </button>
  );
}

export default AuthButton;