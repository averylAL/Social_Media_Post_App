const jwt = require('jsonwebtoken');


const SECRET_KEY = "hihihihihihihi";

function generateToken(payload) {

    return jwt.sign({payload}, SECRET_KEY, {
        // Token expires in 14 days
        expiresIn: '14d'
    });

}

function decrypt(token) {
    try {
        const decoded =  jwt.verify(token, SECRET_KEY)
        return decoded.payload;
    } catch (err) {
        return false;        
    }
}

module.exports = {
    generateToken,
    decrypt,
}