/**
 * Homepage displaying all posts
 */

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostList from '../components/PostList';

const HomePage = () => {
    const { user, loading } = useContext(AuthContext);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="homepage">
            <PostList />
        </div>
    );
};

export default HomePage;


