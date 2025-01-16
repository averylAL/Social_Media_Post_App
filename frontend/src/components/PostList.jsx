/**
 * Component for displacing posts
 */
import '../styles/PostList.css';
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import PostForm from './PostForm';
import Post from './Post';

export default function PostList({ username }) {
    const { user: activeUser } = useContext(AuthContext);
    const [postDetailState, setPostDetailState] = useState([]);
    const [errorMsgState, setErrorMsgState] = useState(null);
    const [loadingState, setLoadingState] = useState(true);

    useEffect(() => {
        getPosts();
    }, []);

    async function getPosts() {
        try {
            const response = await axios.get('/api/post');
            const allPosts = response.data;
            const filteredPosts = username
                ? allPosts.filter((post) => post.username === username)
                : allPosts;
            const sortedPosts = filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setPostDetailState(sortedPosts);
        } catch (error) {
            setErrorMsgState('Failed to fetch posts. Please try again.');
            console.error(error);
        } finally {
            setLoadingState(false);
        }
    }

    async function deletePost(postId) {
        try {
            await axios.delete(`/api/post/${postId}`);
            getPosts();
        } catch (error) {
            setErrorMsgState('Failed to delete the post. Please try again.');
            console.error(error);
        }
    }

    async function updatePost(updatedPost) {
        try {
            await axios.put(`/api/post/${updatedPost._id}`, updatedPost);
            getPosts();
        } catch (error) {
            setErrorMsgState('Failed to update the post. Please try again.');
            console.error(error);
        }
    }

    function closeErrorMsg() {
        setErrorMsgState(null);
    }

    if (loadingState) return <div>Loading posts...</div>;

    return (
        <div className="post-list">
            {errorMsgState && (
                <div className="error-message">
                    <p>{errorMsgState}</p>
                    <button onClick={closeErrorMsg}>Close</button>
                </div>
            )}
            {/* active user on home page or active user on their user page */}
            {((activeUser && !username) || (activeUser && activeUser.username === username)) && (
                <div className="post" ><PostForm onPostAdded={getPosts} /></div>
            )}
            {postDetailState && postDetailState.length > 0 ? (
                postDetailState.map((post) => (
                    <Post
                        key={post._id}
                        post={post}
                        activeUser={activeUser}
                        onEdit={() => {}}
                        onDelete={deletePost}
                        onUpdate={updatePost}
                    />
                ))
            ) : (
                <div className="post">No posts available.</div>
            )}
        </div>
    );
}