
// server/src/controllers/orderController.js
const pool = require('../config/db');
const transporter = require('../config/emailConfig');

const createOrder = async (req, res) => {
    const { items } = req.body; // items - це масив з об'єктами { product_id, quantity }
    try {
        let total = 0;
        let orderDetails = '';
        let sellers = new Set();

        // Підрахунок загальної суми замовлення і формування деталей замовлення
        for (let item of items) {
            const [product] = await pool.query('SELECT name, price, image, user_id FROM products WHERE id = ?', [item.product_id]);
            if (product.length === 0) {
                return res.status(404).json({ message: `Product with id ${item.product_id} not found` });
            }
            if (!product[0].user_id) {
                return res.status(400).json({ message: `Product with id ${item.product_id} does not have an associated seller` });
            }
            total += product[0].price * item.quantity;
            orderDetails += `
                <tr>
                    <td><img src="${product[0].image}" alt="${product[0].name}" width="50"/></td>
                    <td>${product[0].name}</td>
                    <td>${item.quantity}</td>
                    <td>${product[0].price}</td>
                </tr>
            `;

            // Зберігання електронних адрес продавців
            const [sellerInfo] = await pool.query('SELECT email FROM users WHERE id = ?', [product[0].user_id]);
            if (sellerInfo.length > 0) {
                sellers.add(sellerInfo[0].email);
            }
        }

        // Перевірка наявності продавців
        if (sellers.size === 0) {
            return res.status(404).json({ message: 'No sellers found for the provided products' });
        }

        // Створення нового замовлення
        const [result] = await pool.query('INSERT INTO orders (user_id, total) VALUES (?, ?)', [req.user.id, total]);

        // Додавання деталей замовлення
        for (let item of items) {
            const [product] = await pool.query('SELECT price FROM products WHERE id = ?', [item.product_id]);
            await pool.query('INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
                [result.insertId, item.product_id, item.quantity, item.quantity * product[0].price]);
        }

        // Перевірка та логування змінних
        console.log('User Email:', req.user.email);
        console.log('Seller Emails:', Array.from(sellers));

        // Відправка листа з деталями замовлення
        const sellerEmailsArray = Array.from(sellers);
        await transporter.sendMail({
            to: req.user.email,
            subject: `Ваше замовлення ${result.insertId} отримано продавцями`,
            html: `
                <h1>Деталі замовлення</h1>
                <table>
                    <tr>
                        <th>Фото</th>
                        <th>Назва товару</th>
                        <th>Кількість</th>
                        <th>Ціна</th>
                    </tr>
                    ${orderDetails}
                </table>
                <p>Загальна сума: ${total}</p>
            `
        });

        res.status(201).json({ message: 'Order created successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        // Видалення деталей замовлення
        await pool.query('DELETE FROM order_items WHERE order_id = ?', [id]);
        // Видалення замовлення
        await pool.query('DELETE FROM orders WHERE id = ?', [id]);

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const [order] = await pool.query('SELECT * FROM orders WHERE id = ?', [id]);
        if (order.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const [items] = await pool.query('SELECT * FROM order_items WHERE order_id = ?', [id]);
        res.json({ order: order[0], items });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const [orders] = await pool.query('SELECT * FROM orders WHERE user_id = ?', [req.user.id]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
// Ці ODER контроллери під питанням, не знаю чи знадобляться в такому вигляді
const increaseQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Кількість для збільшення
    try {
        const [product] = await pool.query('SELECT * FROM order_items WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        await pool.query('UPDATE order_items SET quantity = quantity + ? WHERE id = ?', [quantity, id]);
        res.json({ message: 'Quantity increased successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const decrementQuantity = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body; // Кількість для зменшення
    try {
        const [product] = await pool.query('SELECT * FROM order_items WHERE id = ?', [id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'Product not found' });
        }
        if (product[0].quantity < quantity) {
            return res.status(400).json({ message: 'Insufficient quantity' });
        }
        await pool.query('UPDATE order_items SET quantity = quantity - ? WHERE id = ?', [quantity, id]);
        res.json({ message: 'Quantity decreased successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    deleteOrder,
    getOrder,
    getUserOrders,
    increaseQuantity,
    decrementQuantity
};



