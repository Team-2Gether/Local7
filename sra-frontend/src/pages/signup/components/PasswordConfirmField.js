// src/pages/signup/components/PasswordConfirmField.js
import React from 'react';
import InputField from './InputField';
import StatusMessage from './StatusMessage'; // Corrected import path

function PasswordConfirmField({ label, id, name, value, onChange, userPassword, required }) {
  const showMismatchError = value && userPassword !== value;

  return (
    <div className="form-group">
      <InputField
        label={label}
        id={id}
        name={name}
        type="password"
        value={value}
        onChange={onChange}
        required={required}
      />
      {showMismatchError && <StatusMessage type="error" message="비밀번호가 일치하지 않습니다." />}
    </div>
  );
}

export default PasswordConfirmField;