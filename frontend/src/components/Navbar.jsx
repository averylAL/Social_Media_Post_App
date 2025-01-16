/**
 * Navigation bar component
 * Displays "Log In" and "Sign Up" when the user is logged out.
 * Displays the username and a "Log Out" button when the user is logged in.
 */
import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../styles/Navbar.css';

const NavBar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    // redirect to home page after logging out
    navigate('/');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchQuery}`);
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="homePage-button">Home</Link>
      </div>
      <div className="navbar-center">
        <form onSubmit={handleSearchSubmit} className="search-form">
          <input
            type="text"
            placeholder="Search for users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">Search</button>
        </form>
      </div>
      <div className="navbar-right">
        {user ? (
          <>
            <span>
                <span className="navbar-welcome">Welcome,</span>
                  <Link to={`/user/${user.username}`} className="navbar-username-link">
                    <strong className="navbar-username">{user.username}</strong>
                  </Link>
                </span>
            <button className="navbar-logout" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" className="navbar-link">Log In</Link>
            <Link to="/signup" className="navbar-link">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
