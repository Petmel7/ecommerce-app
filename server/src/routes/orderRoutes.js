
// server/src/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrder, getUserOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder); // Створення нового замовлення
router.get('/:id', protect, getOrder); // Отримання інформації про замовлення за ідентифікатором
router.get('/', protect, getUserOrders); // Отримання всіх замовлень користувача

module.exports = router;

