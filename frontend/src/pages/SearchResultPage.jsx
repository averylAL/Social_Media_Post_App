/**
 * Search page 
 */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/SearchResultPage.css';

const SearchResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search).get('q');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!query) {
      setError('Search query cannot be empty.');
      setResults([]); // clear previous results
      navigate('/search');
      return;
    }

    setError(null); // reset errorMessage 
    setResults([]);

    if (query) {
      axios
        .get(`/api/user/search/${query}`, {
            withCredentials: true, })
        .then(response => setResults(response.data))
        .catch(error => {
            console.error('Error fetching search results:', error);
            setError('Unable to fetch search results.');
        });
    }
  }, [query]);

  const handleCloseError = () => {
    setError(null); // clear the error state when the close button is clicked
    navigate('/search');
  };

  return (
    <div className="search-results-page">
      <h1>Search Results</h1>
      {error && 
        (
          <div className="error-message">
            <p>{error}</p>
            <button
              className="close-error-button"
              onClick={handleCloseError}
            >
              Close
            </button>
          </div>
        )
      }
      {results.length > 0 ? (
        <ul className="results-list">
          {results.map((user) => (
            <li key={user._id}>
              <Link to={`/user/${user.username}`} className="result-link">
                {user.username}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found matching "{query}".</p>
      )}
    </div>
  );
};

export default SearchResultPage;
