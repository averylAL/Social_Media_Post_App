import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // store user information
    const [loading, setLoading] = useState(true); // for async operation - token verification

    useEffect(() => {
      // check if the user is logged in
      const checkLoginStatus = async () => {
          try {
              const response = await axios.get('/api/user/isLoggedIn', {
                  withCredentials: true, 
              });
              setUser({
                  username: response.data.username,
                  isAdmin: response.data.isAdmin,
              });
          } catch (error) {
              console.error('User is not logged in:', error);
              setUser(null);
          } finally {
              setLoading(false);
          }
      };

      checkLoginStatus();
  }, []);

    // Login function
    const login = (token, userInfo) => {
      localStorage.setItem('userToken', token);
      setUser(userInfo);
    };

    // Logout function
    const logout = async () => {
      try {
          await axios.post('/api/user/logout', {}, { withCredentials: true }); 
      } catch (error) {
          console.error('Error during logout:', error);
      } finally {
          localStorage.removeItem('userToken'); 
          setUser(null); // reset user state
      }
  };

    return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
};

export default AuthProvider;
