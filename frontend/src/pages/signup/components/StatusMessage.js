import React from 'react';

function StatusMessage({ type, message }) {
  if (!message) return null;

  let className = '';
  switch (type) {
    case 'success':
      className = 'success-message';
      break;
    case 'error':
      className = 'error-message';
      break;
    case 'info':
      className = 'info-message';
      break;
    default:
      className = '';
  }

  return <p className={className}>{message}</p>;
}

export default StatusMessage;