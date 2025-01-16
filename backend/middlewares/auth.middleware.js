const jwtHelpers = require('../helpers/jwt');

// Function to authorize user deletion
function authorizeDeletion(req, res, next) {
    const token = req.cookies.userToken; 
    const user = jwtHelpers.decrypt(token); 

    if (!user) {
        res.status(401).send('Unauthorized: No valid token provided');
        return;
    }

    const usernameToDelete = req.params.username;

    // Allow deletion if:
    // 1. User is deleting their own account
    // 2. User is an admin
    if (user.username === usernameToDelete || user.isAdmin) {
        req.user = user; // attach user info to the request for further use
        next(); // user is authorized, proceed to the next middleware or handler
    } else {
        res.status(403).send('You are not authorized to delete this account');
    }
}

module.exports = {
    authorizeDeletion,
};