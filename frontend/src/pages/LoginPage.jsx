/**
 * Login page
 */

import '../styles/LoginPage.css';
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { AuthContext } from '../context/AuthContext';

const LoginPage = () => {
  const { user } = useContext(AuthContext);

  // if user already log in, direct to HomePage
  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="login-page">
      <LoginForm />
    </div>
  );
};

export default LoginPage;