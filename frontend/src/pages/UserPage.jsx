/**
 * UserPage displaying all user posts and user information
 */
import React from 'react';
import PostList from '../components/PostList';
import UserProfile from '../components/UserProfile';
import { useParams } from 'react-router-dom';

export default function UserPage(){

  const { userName } = useParams(); 

  return (
    <div>
      <UserProfile />
      <PostList username={userName} />
    </div>
  );
};
