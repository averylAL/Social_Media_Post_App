import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/LoginForm.css';
import { AuthContext } from '../context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async (e) => {
    e.preventDefault(); // prevent form default submission behavior
    setError(''); // clear previous errors

    try {
      const response = await axios.post('/api/user/login', { username, password });
      const { token } = response.data;

      // use context to update user status
      login(token, { username });
      alert('Login successful!');
    } catch (err) {
      console.error(err.response?.data || 'Login error');
      setError(err.response?.data || 'Invalid username or password');
    }
  };

  return (
    <div className="login-form-container">
      <form className="login-form" onSubmit={handleLogin}>
        <h2>Login</h2>
        {error && (
            <div className="error-message">
            <p>{error}</p>
            <button onClick={() => setError('')} className="close-error-button">Close</button>
          </div>
        )}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">Login</button>
      </form>
    </div>
  );
};

export default LoginForm;
