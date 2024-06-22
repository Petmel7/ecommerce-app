
// server/src/routes/orderRoutes.js
const express = require('express');
const { createOrder, getOrder, getUserOrders, deleteOrder, increaseQuantity, decrementQuantity } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.get('/:id', protect, getOrder);
router.get('/', protect, getUserOrders);
router.delete('/:id', protect, deleteOrder); // Додано маршрут для видалення замовлення
router.patch('/:id/increment', protect, increaseQuantity); // Додано маршрут для зміни кількості +
router.patch('/:id/decrement', protect, decrementQuantity); // Додано маршрут для зміни кількості -

module.exports = router;


