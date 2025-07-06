import React from 'react';

function InputField({ label, id, name, type = 'text', value, onChange, onBlur, required, disabled }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={required}
        disabled={disabled}
      />
    </div>
  );
}

export default InputField;