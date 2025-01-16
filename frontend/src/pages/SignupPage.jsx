/**
 * Sign up page
 */
import React, { useState, useContext } from 'react';
import axios from 'axios';
import '../styles/SignupPage.css';
import { AuthContext } from '../context/AuthContext'; 

const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const { login } = useContext(AuthContext);

  const handleSignup = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post('/api/user/signup', { username, password });
      setSuccessMessage(response.data.message || 'Sign up successful!');
      setUsername('');
      setPassword('');
      setConfirmPassword('');

      // automatically log in the user
      const loginResponse = await axios.post('/api/user/login', {
        username,
        password,
      });

      // extract token and login user
      const { token } = loginResponse.data;
      login(token, { username });

      setSuccessMessage('Signup and login successful! Redirecting...');
      setTimeout(() => {
        window.location.href = '/';
      }, 100);

    } catch (error) {
      console.error(error.response?.data || error.message);
      setErrorMessage(error.response?.data || 'Signup failed. Please try again.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="signup-page">
      <h1>Sign Up</h1>
      <form className="signup-form" onSubmit={handleSignup}>
        {errorMessage && (
          <div className="error-message">
            <p>{errorMessage}</p>
            <button onClick={() => setErrorMessage('')} className="close-error-button">Close</button>
          </div>
        )}
        {successMessage && <p className="success-message">{successMessage}</p>}

        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
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
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password:</label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="signup-button">Sign Up</button>
      </form>
    </div>
  );
};

export default SignupPage;
