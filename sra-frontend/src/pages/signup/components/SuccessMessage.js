import React from 'react';

function SuccessMessage({ message }) {
  if (!message) return null;
  return <p className="success-message">{message}</p>;
}

export default SuccessMessage;