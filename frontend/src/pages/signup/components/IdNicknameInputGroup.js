import React from 'react';
import InputField from './InputField';
import AuthButton from './AuthButton';
import StatusMessage from './StatusMessage';

function IdNicknameInputGroup({
  label,
  id,
  name,
  value,
  onChange,
  onBlur,
  onClickCheck,
  isDuplicate,
  fieldMessage,
  required = true
}) {
  return (
    <div className="form-group1">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-button1">
        <InputField
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          required={required}
          label=""
        />
        <AuthButton
          onClick={onClickCheck}
          disabled={!value}
          className="btn-check-duplicate1"
        >
          중복확인
        </AuthButton>
      </div>
      {fieldMessage && <StatusMessage type="error" message={fieldMessage} />}
      {isDuplicate === false && <StatusMessage type="success" message={`사용 가능한 ${label.slice(0, -1)}입니다.`} />}
    </div>
  );
}

export default IdNicknameInputGroup;
