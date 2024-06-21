
// server/src/routes/userRoutes.js
const express = require('express');
const { registerUser, confirmEmail, loginUser, getUserProfile } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.get('/confirm/:token', confirmEmail); // Маршрут для підтвердження електронної пошти
router.post('/login', loginUser);
router.get('/profile', protect, getUserProfile);

module.exports = router;


