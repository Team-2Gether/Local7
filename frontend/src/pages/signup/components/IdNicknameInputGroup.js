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
  isDuplicate, // null: not checked, true: duplicate, false: available
  fieldMessage,
  required = true
}) {
  return (
    <div className="form-group">
      <label htmlFor={id}>{label}</label>
      <div className="input-with-button">
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
          className="btn-check-duplicate"
        >
          중복확인
        </AuthButton>
      </div>
      {fieldMessage && <StatusMessage type="error" message={fieldMessage} />} {/* StatusMessage 사용 */}
      {isDuplicate === false && <StatusMessage type="success" message={`사용 가능한 ${label.slice(0, -1)}입니다.`} />} {/* StatusMessage 사용 */}
    </div>
  );
}

export default IdNicknameInputGroup;