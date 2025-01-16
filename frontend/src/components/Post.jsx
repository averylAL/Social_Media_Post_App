/**
 * Post component
 * Displays individual post and allows for editing post
 */
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import '../styles/PostList.css';

export default function Post({ post, activeUser, onDelete, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);

    const handleUpdate = (e) => {
        e.preventDefault();
        const updatedContent = e.target.elements.content.value;
        console.log(updatedContent)
        onUpdate({ ...post, content: updatedContent });
        setIsEditing(false);
    };

    const authorized = activeUser && (activeUser.username === post.username);

    return (

            <div className="post">
                <Link to={`/user/${post.username}`} className="post-link">
                <h3>{post.username}</h3>
                </Link>
                <small className="timeStamp">{new Date(post.timestamp).toLocaleString()}</small>
                
                {isEditing ? (
                    <form onSubmit={handleUpdate}>
                        <textarea name="content" defaultValue={post.content}></textarea>
                        <div>
                            <button type="submit">Update</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </form>
                ) : (
                    <Link to={`/user/${post.username}`} className="content-link">
                    <p >{post.content}</p>
                    </Link>
                )}

                {authorized && (
                    <div>
                        <button onClick={() => setIsEditing(true)}>Edit</button>
                        <button onClick={() => onDelete(post._id)}>Delete</button>
                    </div>
                )}
            </div>
    );
}