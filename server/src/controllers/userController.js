
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const transporter = require('../config/emailConfig');
const { generateAccessToken, generateRefreshToken, generateConfirmationCode } = require('../auth/auth');

const registerUser = async (req, res) => {
    const { name, lastname, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            lastname,
            email,
            password: hashedPassword
        });

        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const url = `http://localhost:5000/api/users/confirm/${token}`;

        await transporter.sendMail({
            to: email,
            subject: 'Confirm your email',
            html: `Click <a href="${url}">here</a> to confirm your email.`
        });

        res.status(201).json({ message: 'User registered successfully. Please check your email to confirm.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: error.message });
    }
};

const confirmEmail = async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        await User.update({ emailconfirmed: true }, { where: { email: decoded.email } });
        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

const addPhoneNumber = async (req, res) => {
    const { phone } = req.body;
    try {
        console.log('Request received:', req.body);

        const user = await User.findByPk(req.user.id);

        if (!user) {
            console.log('User not found');
            return res.status(404).json({ message: 'User not found' });
        }

        const confirmationcode = generateConfirmationCode();

        await user.update({ phone, confirmationcode });

        // Отримуємо email з об'єкта user
        const email = user.email;

        console.log('Sending email to:', email);

        await transporter.sendMail({
            to: email,
            subject: 'Confirm your phone by email',
            html: `<div>Your phone verification code ${confirmationcode}</div>`
        });

        console.log('Email sent successfully');

        res.status(200).json({ message: 'Phone number added and confirmation email sent' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const confirmPhoneNumber = async (req, res) => {
    const { confirmationcode } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.confirmationcode === confirmationcode) {
            await user.update({ phoneconfirmed: true, confirmationcode: null });
            res.json({ message: 'Phone number confirmed successfully.' });
        } else {
            res.status(400).json({ message: 'Invalid confirmation code.' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
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

        // // Дозволити користувачам входити в систему, навіть якщо телефон не підтверджений
        // if (!user.phoneconfirmed) {
        //     return res.status(400).json({ message: 'Phone number not confirmed' });
        // }

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshToken(user.id);

        // Збереження refresh token у базі даних
        await RefreshToken.create({ user_id: user.id, token: refreshToken });

        res.json({ accessToken, refreshToken });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const logoutUser = async (req, res) => {
    const { token } = req.body;
    if (!token) {
        return res.status(400).json({ message: 'No token provided' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        await RefreshToken.destroy({ where: { token } });
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to log out' });
    }
};

const getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id, {
            attributes: ['id', 'name', 'lastname', 'email', 'phone', 'phoneconfirmed']
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

        const result = await RefreshToken.destroy({ where: { createdat: { [Op.lt]: expirationDate } } });
        console.log(`Old refresh tokens deleted: ${result} tokens removed`);
    } catch (error) {
        console.error('Error deleting old refresh tokens:', error);
    }
};

module.exports = {
    registerUser,
    confirmEmail,
    addPhoneNumber,
    confirmPhoneNumber,
    loginUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    deleteOldRefreshTokens
};
