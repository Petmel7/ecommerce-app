
const express = require('express');
const { registerUser, confirmEmail, addPhoneNumber, confirmPhoneNumber, loginUser, getUserProfile, refreshToken, logoutUser } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/confirm/:token', confirmEmail); // Маршрут для підтвердження електронної пошти
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);
router.post('/refresh-token', refreshToken); // Додано маршрут для оновлення токенів
router.post('/add-phone', protect, addPhoneNumber); // Додано маршрут для додавання номера телефону
router.post('/confirm-phone', protect, confirmPhoneNumber); // Додано маршрут для підтвердження номера телефону

module.exports = router;






