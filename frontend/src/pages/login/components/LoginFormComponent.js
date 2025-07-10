// src/pages/login/LoginFormComponent.js
import React from 'react';

function LoginFormComponent({ credential, setCredential, password, setPassword, handleSubmit, isLoading }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          id="credential"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder="Email or ID"
          required
          disabled={isLoading}
        />
      </div>
      <div className="form-group">
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          disabled={isLoading}
        />
      </div>
      <button type="submit" disabled={isLoading}>
        {isLoading ? '로그인 중...' : 'LOGIN'}
      </button>
    </form>
  );
}

export default LoginFormComponent;