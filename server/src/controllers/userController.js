
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const RefreshToken = require('../models/RefreshToken');
const transporter = require('../config/emailConfig');
const vonage = require('../config/vonageConfig');

const generateAccessToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const generateRefreshToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

const generateConfirmationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword
        });

        console.log('newUser', newUser); // Логування нового користувача для перевірки

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
        await User.update({ confirmed: true }, { where: { email: decoded.email } });
        res.status(200).json({ message: 'Email confirmed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Invalid or expired token' });
    }
};

const addPhoneNumber = async (req, res) => {
    const { phone } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const confirmationCode = generateConfirmationCode();

        await user.update({ phone, confirmationCode });

        // Надсилання SMS з підтвердженням
        const from = process.env.VONAGE_FROM_NUMBER;
        const to = phone;
        const text = `Your confirmation code is ${confirmationCode}`;

        await vonage.sms.send({ to, from, text })
            .then(resp => {
                console.log('Message sent successfully');
                console.log(resp);
                res.status(200).json({ message: 'Phone number added. Please check your phone for the confirmation code.' });
            })
            .catch(err => {
                console.error('Error sending SMS:', err);
                res.status(500).json({ message: 'Error sending SMS' });
            });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const confirmPhoneNumber = async (req, res) => {
    const { confirmationCode } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.confirmationCode === confirmationCode) {
            await user.update({ phoneConfirmed: true, confirmationCode: null });
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
        // if (!user.phoneConfirmed) {
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
            attributes: ['id', 'name', 'email', 'phone', 'phoneConfirmed']
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
    addPhoneNumber,
    confirmPhoneNumber,
    loginUser,
    logoutUser,
    getUserProfile,
    refreshToken,
    deleteOldRefreshTokens
};
