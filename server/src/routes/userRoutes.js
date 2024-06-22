
// server/src/routes/userRoutes.js
const express = require('express');
const { registerUser, confirmEmail, loginUser, getUserProfile, refreshToken } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/confirm/:token', confirmEmail); // Маршрут для підтвердження електронної пошти
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);
router.post('/refresh-token', refreshToken); // Додано маршрут для оновлення токенів

module.exports = router;


