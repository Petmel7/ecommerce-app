
// server/src/controllers/productController.js
const pool = require('../config/db');

const getProducts = async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getProductById = async (req, res) => {
    const { id } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM products WHERE user_id = ?', [id]);
        if (rows.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addProduct = async (req, res) => {
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.path : null;
    try {
        await pool.query('INSERT INTO products (user_id, name, description, price, stock, image) VALUES (?, ?, ?, ?, ?, ?)',
            [req.user.id, name, description, price, stock, image]);
        res.status(201).json({ message: 'Product added successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock } = req.body;
    const image = req.file ? req.file.path : null;
    try {
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product[0].id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to update this product' });
        }
        await pool.query('UPDATE products SET name = ?, description = ?, price = ?, stock = ?, image = ? WHERE id = ?',
            [name, description, price, stock, image, id]);
        res.json({ message: 'Product updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const [product] = await pool.query('SELECT * FROM products WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product[0].id !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to delete this product' });
        }
        await pool.query('DELETE FROM products WHERE id = ?', [id]);
        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};



