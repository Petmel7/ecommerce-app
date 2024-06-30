const jwt = require('jsonwebtoken');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
    generateConfirmationCode
}