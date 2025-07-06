// src/pages/login/LoginFormComponent.js
import React from 'react';

function LoginFormComponent({ credential, setCredential, password, setPassword, handleSubmit }) {
  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          type="text"
          id="credential"
          value={credential}
          onChange={(e) => setCredential(e.target.value)}
          placeholder="Email"
          required
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
        />
      </div>
      <button type="submit">LOGIN</button>
    </form>
  );
}

export default LoginFormComponent;