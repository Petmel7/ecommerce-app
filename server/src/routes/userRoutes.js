
const express = require('express');
const passport = require('../config/passport');
const { registerUser, confirmEmail, addPhoneNumber, confirmPhoneNumber, loginUser, getUserProfile, refreshToken, logoutUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { generateAccessToken } = require('../auth/auth');
const router = express.Router();

router.post('/register', registerUser);
router.get('/confirm/:token', confirmEmail); // Маршрут для підтвердження електронної пошти
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.post('/refresh-token', refreshToken); // Додано маршрут для оновлення токенів
router.post('/add-phone', protect, addPhoneNumber); // Додано маршрут для додавання номера телефону
router.post('/confirm-phone', protect, confirmPhoneNumber); // Додано маршрут для підтвердження номера телефону

// Маршрути для авторизації через Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
    req.login(req.user, (err) => {
        if (err) {
            return res.status(500).json({ message: 'Login error' });
        }
        const token = generateAccessToken(req.user.id);
        res.redirect(`http://localhost:5000?token=${token}`);
    });
});

module.exports = router;







