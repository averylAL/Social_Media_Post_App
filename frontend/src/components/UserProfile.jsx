/**
 * Display user profile details
 */
import '../styles/UserProfile.css';
import axios from "axios";
import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useParams } from 'react-router-dom';

export default function UserProfile(){
    const {userName} = useParams();
    const [userState, setUserState] = useState(null)
    const [loadingState, setLoadingState] = useState(true);
    const [errorMsgState, setErrorMsgState] = useState(null);
    const [editingUserDesc, setEditingUserDesc] = useState(false);
    const [userDescState, setUserDescState] = useState('')
    const { user: activeUser } = useContext(AuthContext); // Logged-in user

    useEffect(() => {
        getUserData();
    }, [userName]);

    async function getUserData() {
        try {
            setLoadingState(true)
            const response = await axios.get(`/api/user/${userName}`);
            console.log('userName from URL:', userName);
            console.log(response.data)
            setUserState(response.data);
        } catch (err) {
            setErrorMsgState("Error loading user data.");
        } finally {
            setLoadingState(false);
        }
    }

    async function updateUserDescription(e) {
        e.preventDefault();
        try {
            const updatedDescription = { description: userDescState };
            console.log("Updated Description:", updatedDescription);
            const response = await axios.put(
                `/api/user/${userName}/description`,
                updatedDescription
            );
            console.log('API Response:', response.data);
            setEditingUserDesc(false); 
            getUserData();
        } catch (error) {
            console.error('Error updating description:', error.response?.data || error.message);
            setErrorMsgState('Failed to update the description. Please try again.');
        }
    }

    if (loadingState) {
        return <div>Loading user information...</div>
    }

    function closeErrorMsg(){
        setErrorMsgState(null);
    }

    return (
        <div className='user-profile'>
            <div className="profile">
                {errorMsgState && (
                    <div className="error-message">
                        <p>{errorMsgState}</p>
                        <button onClick={closeErrorMsg}>Close</button>
                    </div>
                )}

                {/* Check if userState is defined before accessing its properties */}
                {userState ? (
                    <>
                        <h1 >{userState.username}</h1>
                        <small className="timeStamp">
                        Joined since {new Date(userState.timestamp).toLocaleDateString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                    })}
                        </small>
                        {editingUserDesc ? (
                            <form onSubmit={updateUserDescription}>
                                <textarea
                                    placeholder="Edit your description"
                                    value={userDescState}
                                    onChange={(e) => setUserDescState(e.target.value)}
                                    className="post-textarea"
                                />
                                <button type="submit" className="post-button">
                                    Save
                                </button>
                                <button
                                    type="button"
                                    className="cancel-button"
                                    onClick={() => setEditingUserDesc(false)}
                                >
                                    Cancel
                                </button>
                            </form>
                        ) : (
                            <p className='description'>{userState.description || ' '}</p>
                        )}
                        {activeUser && activeUser.username === userName ? <button onClick={() => setEditingUserDesc(true)}>Edit description</button> : <></>}
                    </>
                ) : (
                    <p>User data is not available.</p>
                )}
            </div>
        </div>

    )
}