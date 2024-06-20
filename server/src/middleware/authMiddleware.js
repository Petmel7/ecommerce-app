
// server/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            console.log('Decoded token:', decoded);
            req.user = decoded;
            next();
        } catch (error) {
            console.error('JWT verification failed:', error);
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        console.error('No token provided');
        res.status(401).json({ message: 'Not authorized, no token' });
    }
};

module.exports = { protect };



