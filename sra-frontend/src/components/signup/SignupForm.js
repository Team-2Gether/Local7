import React, { useState } from 'react';
import axios from 'axios';
import './SignupForm.css'; // Optional: for basic styling

function SignupForm() {
  const [formData, setFormData] = useState({
    userLoginId: '',
    userPassword: '',
    userPasswordConfirm: '', // For client-side password confirmation
    userEmail: '',
    userNickname: '',
    userUsername: '',
    userProfileImageUrl: '',
    userBio: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [messages, setMessages] = useState({}); // To store messages (success/error) for each field or action
  const [duplicateStatus, setDuplicateStatus] = useState({ // To store explicit duplicate check results
    userLoginId: null, // null: not checked, true: duplicate, false: available
    userNickname: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear field-specific messages and duplicate status when input changes
    setMessages((prev) => ({ ...prev, [name]: '' }));
    if (name === 'userLoginId' || name === 'userNickname') {
      setDuplicateStatus((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleEmailChange = (e) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      userEmail: value,
    });
    setEmailSent(false); // Reset email sent status
    setEmailVerified(false); // Reset email verification status
    setMessages((prev) => ({ ...prev, userEmail: '' }));
  };

  const handleVerificationCodeChange = (e) => {
    setVerificationCode(e.target.value);
    setMessages((prev) => ({ ...prev, verificationCode: '' }));
  };

  const handleSendVerificationCode = async () => {
    setMessages({}); // Clear all messages
    if (!formData.userEmail) {
      setMessages({ userEmail: '이메일을 입력해주세요.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup/send-email-code', {
        email: formData.userEmail,
      });
      if (response.data.status === 'success') {
        setMessages({ general: response.data.message, emailStatus: 'pending' });
        setEmailSent(true);
      } else {
        setMessages({ general: response.data.message });
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '이메일 전송 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
    }
  };

  const handleVerifyEmailCode = async () => {
    setMessages({}); // Clear all messages
    if (!verificationCode) {
      setMessages({ verificationCode: '인증 코드를 입력해주세요.' });
      return;
    }

    try {
      const response = await axios.post('http://localhost:8080/api/signup/verify-email-code', {
        email: formData.userEmail,
        code: verificationCode,
      });
      if (response.data.status === 'success') {
        setMessages({ general: response.data.message });
        setEmailVerified(true);
        setMessages((prev) => ({ ...prev, emailStatus: 'verified' }));
      } else {
        setMessages({ general: response.data.message });
        setEmailVerified(false);
        setMessages((prev) => ({ ...prev, emailStatus: 'failed' }));
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || '인증 코드 확인 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
      setEmailVerified(false);
      setMessages((prev) => ({ ...prev, emailStatus: 'failed' }));
    }
  };

  const checkDuplicate = async (field, value, updateStatus = true) => {
    if (!value) {
      if (updateStatus) {
        setMessages((prev) => ({ ...prev, [field]: '' }));
        if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
        if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
      }
      return false;
    }

    try {
      const response = await axios.get(`http://localhost:8080/api/signup/check-duplicate/${field}/${value}`);
      if (response.data.isDuplicate) {
        setMessages((prev) => ({ ...prev, [field]: `이미 사용 중인 ${field === 'login-id' ? '아이디' : '닉네임'}입니다.` }));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: true }));
          if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: true }));
        }
        return true;
      } else {
        setMessages((prev) => ({ ...prev, [field]: '' }));
        if (updateStatus) {
          if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: false }));
          if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: false }));
        }
        return false;
      }
    } catch (error) {
      console.error(`Error checking duplicate ${field}:`, error);
      setMessages((prev) => ({ ...prev, [field]: `중복 확인 중 오류가 발생했습니다.` }));
      if (updateStatus) {
        if (field === 'login-id') setDuplicateStatus((prev) => ({ ...prev, userLoginId: null }));
        if (field === 'nickname') setDuplicateStatus((prev) => ({ ...prev, userNickname: null }));
      }
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessages({}); // Clear all messages at the start of submission

    // Client-side validations
    if (formData.userPassword !== formData.userPasswordConfirm) {
      setMessages({ general: '비밀번호와 비밀번호 확인이 일치하지 않습니다.' });
      return;
    }
    if (!emailVerified) {
      setMessages({ general: '이메일 인증을 완료해주세요.' });
      return;
    }

    // Perform final duplicate checks before submission
    const isLoginIdDup = await checkDuplicate('login-id', formData.userLoginId, false); // Don't update status for final check
    const isEmailDup = await checkDuplicate('email', formData.userEmail, false); // Assuming email check happens earlier
    const isNicknameDup = await checkDuplicate('nickname', formData.userNickname, false); // Don't update status for final check

    if (isLoginIdDup || isEmailDup || isNicknameDup) {
      setMessages((prev) => ({ ...prev, general: '중복된 정보가 있습니다. 확인해주세요.' }));
      return;
    }

    // Ensure explicit checks were performed and passed if buttons exist
    if (duplicateStatus.userLoginId !== false) {
      setMessages((prev) => ({ ...prev, general: '아이디 중복 확인을 해주세요.' }));
      return;
    }
    if (duplicateStatus.userNickname !== false) {
      setMessages((prev) => ({ ...prev, general: '닉네임 중복 확인을 해주세요.' }));
      return;
    }


    try {
      // Destructure to send only required fields for signup
      const { userPasswordConfirm, ...dataToSend } = formData;
      const response = await axios.post('http://localhost:8080/api/signup/register', dataToSend);
      setMessages({ general: response.data.message || '회원가입 성공!' });
      alert('회원가입 성공: ' + response.data.message);
      
      // Reset form and states on successful signup
      setFormData({
        userLoginId: '', userPassword: '', userPasswordConfirm: '', userEmail: '',
        userNickname: '', userUsername: '', userProfileImageUrl: '', userBio: '',
      });
      setVerificationCode('');
      setEmailSent(false);
      setEmailVerified(false);
      setDuplicateStatus({ userLoginId: null, userNickname: null });

    } catch (error) {
      const errorMessage = error.response?.data?.message || '회원가입 중 오류가 발생했습니다.';
      setMessages({ general: errorMessage });
    }
  };

  return (
    <div className="signup-container">
      <h2>회원가입</h2>
      {messages.general && <p className={`message ${messages.general.includes('성공') ? 'success' : 'error'}`}>{messages.general}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="userLoginId">아이디:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="userLoginId"
              name="userLoginId"
              value={formData.userLoginId}
              onChange={handleChange}
              onBlur={() => checkDuplicate('login-id', formData.userLoginId)}
              required
            />
            <button
              type="button"
              onClick={() => checkDuplicate('login-id', formData.userLoginId)}
              className="btn-check-duplicate"
              disabled={!formData.userLoginId}
            >
              중복확인
            </button>
          </div>
          {messages['login-id'] && <p className="error-message">{messages['login-id']}</p>}
          {duplicateStatus.userLoginId === false && <p className="success-message">사용 가능한 아이디입니다.</p>}
        </div>

        <div className="form-group">
          <label htmlFor="userPassword">비밀번호:</label>
          <input
            type="password"
            id="userPassword"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userPasswordConfirm">비밀번호 확인:</label>
          <input
            type="password"
            id="userPasswordConfirm"
            name="userPasswordConfirm"
            value={formData.userPasswordConfirm}
            onChange={handleChange}
            required
          />
          {formData.userPasswordConfirm && formData.userPassword !== formData.userPasswordConfirm && (
            <p className="error-message">비밀번호가 일치하지 않습니다.</p>
          )}
        </div>

        <div className="form-group">
          <label htmlFor="userEmail">이메일:</label>
          <div className="email-input-group">
            <input
              type="email"
              id="userEmail"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleEmailChange}
              onBlur={() => checkDuplicate('email', formData.userEmail)}
              required
              disabled={emailVerified}
            />
            {!emailVerified && (
              <button
                type="button"
                onClick={handleSendVerificationCode}
                disabled={emailSent || !formData.userEmail}
                className="btn-send-code"
              >
                {emailSent ? '재전송' : '인증코드 전송'}
              </button>
            )}
          </div>
          {messages.userEmail && <p className="error-message">{messages.userEmail}</p>}
          {emailSent && !emailVerified && <p className="info-message">인증 코드가 전송되었습니다. 이메일을 확인해주세요.</p>}
          {emailVerified && <p className="success-message">이메일이 인증되었습니다!</p>}
        </div>

        {emailSent && !emailVerified && (
          <div className="form-group">
            <label htmlFor="verificationCode">인증 코드 (4자리):</label>
            <div className="email-input-group">
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={handleVerificationCodeChange}
                maxLength="4"
                required
              />
              <button type="button" onClick={handleVerifyEmailCode} className="btn-verify-code">
                인증 확인
              </button>
            </div>
            {messages.verificationCode && <p className="error-message">{messages.verificationCode}</p>}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="userNickname">닉네임:</label>
          <div className="input-with-button">
            <input
              type="text"
              id="userNickname"
              name="userNickname"
              value={formData.userNickname}
              onChange={handleChange}
              onBlur={() => checkDuplicate('nickname', formData.userNickname)}
              required
            />
            <button
              type="button"
              onClick={() => checkDuplicate('nickname', formData.userNickname)}
              className="btn-check-duplicate"
              disabled={!formData.userNickname}
            >
              중복확인
            </button>
          </div>
          {messages.nickname && <p className="error-message">{messages.nickname}</p>}
          {duplicateStatus.userNickname === false && <p className="success-message">사용 가능한 닉네임입니다.</p>}
        </div>

        <div className="form-group">
          <label htmlFor="userUsername">이름:</label>
          <input
            type="text"
            id="userUsername"
            name="userUsername"
            value={formData.userUsername}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="userProfileImageUrl">프로필 이미지 URL (선택 사항):</label>
          <input
            type="text"
            id="userProfileImageUrl"
            name="userProfileImageUrl"
            value={formData.userProfileImageUrl}
            onChange={handleChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="userBio">자기소개 (선택 사항):</label>
          <textarea
            id="userBio"
            name="userBio"
            value={formData.userBio}
            onChange={handleChange}
          ></textarea>
        </div>

        <button type="submit" className="btn-submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignupForm;