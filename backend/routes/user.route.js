const express = require('express');
const router = express.Router();
const userModel = require('../db/user.model');
const jwtHelpers = require('../helpers/jwt');
const { authorizeDeletion } = require('../middlewares/auth.middleware');

// Signup
// http://localhost:8000/api/user/signup
router.post('/signup', async function (req, res) {
    const { username, password } = req.body;

    if (!username || !password) {
        res.status(400).send('Username and password are required');
        return;
    }

    try {
        // create a new user
        const newUser = await userModel.createUser({ username, password });
        res.status(201).send({ message: 'User registered successfully!', user: newUser });
    } catch (error) {
        if (error.code === 11000) {
            // duplicate key error (username already exists)
            res.status(400).send('Username is already existed.');
        } else {
            res.status(500).send('Unable to Sign Up. Please try again.');
        }    }
});


// Login
// http://localhost:8000/api/user/login
router.post('/login', async function (req, res) {
    const { username, password } = req.body;

    // Validate required fields
    if (!username || !password) {
        res.status(400).send('Username or password is not valid');
        return;
    }

    try {
        const user = await userModel.validatePassword(username, password);

        // generate a JWT for the logged-in user
        const token = jwtHelpers.generateToken({
            username: user.username,
            isAdmin: user.isAdmin,
        });

        // send token as a cookie
        res.cookie('userToken', token, { httpOnly: true });
        res.status(200).send({ message: 'Login successful', token });
    } catch (error) {
        res.status(401).send('Username or password is not valid');
    }
});

// Log out
router.post('/logout', function(req, res) {
    res.clearCookie('userToken', { 
        httpOnly: true, 
        secure: process.env.NODE_ENV === 'production', 
        sameSite: 'strict',
    });
    res.send({message: 'Logged out successfully'});
})

// Login Status
router.get('/isLoggedIn', (req, res) => {
    const token = req.cookies.userToken;
    if (!token) {
        return res.status(401).send('Not logged in');
    }

    try {
        const decoded = jwtHelpers.decrypt(token);
        res.status(200).send({ username: decoded.username, isAdmin: decoded.isAdmin });
    } catch (error) {
        res.clearCookie('userToken', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
        }); // Clear invalid cookies
        res.status(401).send('Invalid token');
    }
});

// Get
// http://localhost:8000/api/user/:username
router.get('/:username', async function (req, res) {
    const username = req.params.username;

    try {
        const user = await userModel.findUserByUsername(username);

        if (!user) {
            res.status(404).send(`User with username ${username} not found`);
            return;
        }
        // only return non-sensitive user information
        const userDetails = {
            username: user.username,
            timestamp: user.timestamp,
            description: user.description,
        };

        res.status(200).send(userDetails);
    } catch (error) {
        res.status(500).send('Unable to retrieve user');
    }
});


// Update
// http://localhost:8000/api/user/:username/description
router.put('/:username/description', async function (req, res) {
    const username = req.params.username;
    const { description } = req.body;

    if (!description) {
        res.status(400).send('Description is required');
        return;
    }

    const tokenUsername = jwtHelpers.decrypt(req.cookies.userToken).username;
    if (!tokenUsername || tokenUsername !== username) {
        res.status(403).send('You can only update your own description');
        return;
    }

    try {
        const updatedUser = await userModel.updateUserDescription(username, description);

        if (!updatedUser) {
            res.status(404).send(`User with username ${username} not found`);
            return;
        }

        res.status(200).send({ message: 'Description updated successfully', user: updatedUser });
    } catch (error) {
        res.status(500).send('Unable to update user description');
    }
});


// Delete
// http://localhost:8000/api/user/:username
router.delete('/:username', authorizeDeletion, async function (req, res) {
    const username = req.params.username; 
    try {
        // delete the user from the database
        const deletedUser = await userModel.deleteUser(username);

        if (!deletedUser) {
            res.status(404).send(`User with username ${username} not found`);
            return;
        }

        res.status(200).send({ message: `User with username ${username} deleted successfully` });
    } catch (error) {
        res.status(500).send('Unable to delete user: ' + error.message);
    }
});

// Extra Credit: Search for Users
// http://localhost:8000/api/user/:inputPartialUserName
router.get('/search/:inputPartialUserName', async function (req, res) {
    console.log('Search route reached'); // debug
    const inputPartialUserName = req.params.inputPartialUserName;
    console.log('Search route hit with search input:', inputPartialUserName); // debug
    if (!inputPartialUserName) {
        return res.status(400).send('Search query is required');
    }

    try {
        const users = await userModel.searchUsersByName(inputPartialUserName);
        console.log('Found users:', users); // debug
        res.status(200).send(users);
    } catch (error) {
        console.error('Error searching for users:', error);
        res.status(500).send('Unable to search for users.');
    }
});


module.exports = router;