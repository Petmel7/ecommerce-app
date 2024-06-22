
// // server/src/controllers/userController.js
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');
// const transporter = require('../config/emailConfig');

// const generateAccessToken = (userId) => {
//     return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
// };

// const generateRefreshToken = (userId) => {
//     return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
// };

// const registerUser = async (req, res) => {
//     const { name, email, password } = req.body;
//     try {
//         const [existingUser] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//         if (existingUser.length > 0) {
//             return res.status(400).json({ message: 'User already exists' });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword]);

//         const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         const url = `http://localhost:5000/api/users/confirm/${token}`;

//         await transporter.sendMail({
//             to: email,
//             subject: 'Confirm your email',
//             html: `Click <a href="${url}">here</a> to confirm your email.`
//         });

//         res.status(201).json({ message: 'User registered successfully. Please check your email to confirm.' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const confirmEmail = async (req, res) => {
//     const { token } = req.params;
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         await pool.query('UPDATE users SET confirmed = 1 WHERE email = ?', [decoded.email]);
//         res.status(200).json({ message: 'Email confirmed successfully' });
//     } catch (error) {
//         res.status(500).json({ message: 'Invalid or expired token' });
//     }
// };

// const loginUser = async (req, res) => {
//     const { email, password } = req.body;
//     try {
//         const [user] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
//         if (user.length === 0) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const validPassword = await bcrypt.compare(password, user[0].password);
//         if (!validPassword) {
//             return res.status(400).json({ message: 'Invalid credentials' });
//         }

//         const accessToken = generateAccessToken(user[0].id);
//         const refreshToken = generateRefreshToken(user[0].id);

//         // Збереження refresh token у базі даних
//         await pool.query('INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)', [user[0].id, refreshToken]);

//         res.json({ accessToken, refreshToken });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getUserProfile = async (req, res) => {
//     try {
//         const [user] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id]);
//         if (user.length === 0) {
//             return res.status(404).json({ message: 'User not found' });
//         }
//         res.json(user[0]);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const refreshToken = async (req, res) => {
//     const { token } = req.body;
//     if (!token) {
//         return res.status(401).json({ message: 'No token provided' });
//     }
//     try {
//         const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//         const [storedToken] = await pool.query('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
//         if (storedToken.length === 0) {
//             return res.status(401).json({ message: 'Invalid token' });
//         }

//         const newAccessToken = generateAccessToken(decoded.id);
//         const newRefreshToken = generateRefreshToken(decoded.id);

//         // Оновлення refresh token у базі даних
//         await pool.query('UPDATE refresh_tokens SET token = ? WHERE id = ?', [newRefreshToken, storedToken[0].id]);

//         // Видалення старих refresh token
//         await deleteOldRefreshTokens();

//         res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
//     } catch (error) {
//         res.status(401).json({ message: 'Invalid token' });
//     }
// };

// const deleteOldRefreshTokens = async () => {
//     try {
//         const expirationDate = new Date();
//         expirationDate.setDate(expirationDate.getDate() - 7); // Видалення токенів, старших за 7 днів

//         await pool.query('DELETE FROM refresh_tokens WHERE created_at < ?', [expirationDate]);
//         console.log(`Old refresh tokens deleted: ${result.affectedRows} tokens removed`);
//     } catch (error) {
//         console.error('Error deleting old refresh tokens:', error);
//     }
// };

// module.exports = {
//     registerUser,
//     confirmEmail,
//     loginUser,
//     getUserProfile,
//     refreshToken,
//     deleteOldRefreshTokens
// };



// server/src/controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const transporter = require('../config/emailConfig');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const url = `http://localhost:5000/api/users/confirm/${token}`;

        await transporter.sendMail({
            to: email,
            subject: 'Confirm your email',
            html: `Click <a href="${url}">here</a> to confirm your email.`
        });

        res.status(201).json({ message: 'User registered successfully. Please check your email to confirm.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.update({ confirmed: true }, { where: { email: decoded.email } });
        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Збереження refresh token у базі даних
        await RefreshToken.create({ user_id: user.id, token: refreshToken });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'email']
        });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const refreshToken = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        const storedToken = await RefreshToken.findOne({ where: { token } });
        if (!storedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        const newAccessToken = generateAccessToken(decoded.id);
        const newRefreshToken = generateRefreshToken(decoded.id);

        // Оновлення refresh token у базі даних
        storedToken.token = newRefreshToken;
        await storedToken.save();

        // Видалення старих refresh token з логуванням
        await deleteOldRefreshTokens();

        res.json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

const deleteOldRefreshTokens = async () => {
    try {
        const expirationDate = new Date();
        expirationDate.setDate(expirationDate.getDate() - 7); // Видалення токенів, старших за 7 днів

        const result = await RefreshToken.destroy({ where: { createdAt: { [Op.lt]: expirationDate } } });
        console.log(`Old refresh tokens deleted: ${result} tokens removed`);
    } catch (error) {
        console.error('Error deleting old refresh tokens:', error);
    }
};

module.exports = {
    registerUser,
    confirmEmail,
    loginUser,
    getUserProfile,
    refreshToken,
    deleteOldRefreshTokens
};





