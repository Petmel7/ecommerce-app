
const express = require('express');
const { createOrder, deleteOrder, getOrder, getUserOrders, getSellerOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.delete('/:id', protect, deleteOrder);
router.get('/seller', protect, getSellerOrders); // Маршрут для отримання замовлень продавця повинен бути перед маршрутом /:id
router.get('/:id', protect, getOrder);
router.get('/', protect, getUserOrders);

module.exports = router;





