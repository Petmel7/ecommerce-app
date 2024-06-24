
// // server/src/routes/orderRoutes.js
// const express = require('express');
// const { createOrder, getOrder, getUserOrders, deleteOrder } = require('../controllers/orderController');
// const { protect } = require('../middleware/authMiddleware');
// const router = express.Router();

// router.post('/', protect, createOrder);
// router.get('/:id', protect, getOrder);
// router.get('/', protect, getUserOrders);
// router.delete('/:id', protect, deleteOrder);

// module.exports = router;


const express = require('express');
const { createOrder, deleteOrder, getOrder, getUserOrders, getSellerOrders } = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOrder);
router.delete('/:id', protect, deleteOrder);
router.get('/:id', protect, getOrder);
router.get('/', protect, getUserOrders);
router.get('/seller', protect, getSellerOrders); // Маршрут для отримання замовлень продавця

module.exports = router;


