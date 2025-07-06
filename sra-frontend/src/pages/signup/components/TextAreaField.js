import React from 'react';

function TextAreaField({ label, id, name, value, onChange, required }) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
      ></textarea>
    </div>
  );
}

export default TextAreaField;