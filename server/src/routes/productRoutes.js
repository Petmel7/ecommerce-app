
// server/src/routes/productRoutes.js
const express = require('express');
const { getProducts, getProductById, addProduct, updateProduct, deleteProduct, increaseStock, decreaseStock } = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../config/multerConfig');
const router = express.Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', protect, upload.single('image'), addProduct);
router.put('/:id', protect, upload.single('image'), updateProduct);
router.delete('/:id', protect, deleteProduct);
router.patch('/:id/increase', protect, increaseStock); // Додано маршрут для збільшення кількості
router.patch('/:id/decrease', protect, decreaseStock); // Додано маршрут для зменшення кількості

module.exports = router;






