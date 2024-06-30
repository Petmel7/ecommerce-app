
const path = require('path');
const transporter = require('../config/emailConfig');
const { Order, OrderItem, Product, User } = require('../models');

const createOrder = async (req, res) => {
    const { items } = req.body;
    try {
        let total = 0;
        let orderDetails = '';
        let sellers = new Set();
        const baseURL = 'http://localhost:5000/uploads/'; // Змінити на ваш домен, якщо необхідно

        for (let item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                return res.status(404).json({ message: `Product with id ${item.product_id} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Only ${product.stock} items left.` });
            }
            total += product.price * item.quantity;
            const productImageURL = `${baseURL}${path.basename(product.image)}`;

            const seller = await User.findByPk(product.user_id, { attributes: ['name', 'lastName', 'email'] });
            if (seller) {
                sellers.add(seller.email);
            }

            console.log('Product Image URL:', productImageURL); // Логування URL-адреси зображення
            console.log('Seller Info:', seller); // Логування інформації про продавця

            orderDetails += `
                <tr>
                    <td><img src="${productImageURL}" alt="${product.name}" width="50"/></td>
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${product.price}</td>
                    <td>${seller.name} ${seller.lastName}</td>
                </tr>
            `;
        }

        if (sellers.size === 0) {
            return res.status(404).json({ message: 'No sellers found for the provided products' });
        }

        const order = await Order.create({
            user_id: req.user.id,
            total
        });

        for (let item of items) {
            const product = await Product.findByPk(item.product_id);
            await OrderItem.create({
                order_id: order.id,
                product_id: item.product_id,
                quantity: item.quantity,
                price: product.price * item.quantity
            });
            await product.update({ stock: product.stock - item.quantity });
        }

        console.log('User Email:', req.user.email);
        console.log('Seller Emails:', Array.from(sellers));

        const sellerEmailsArray = Array.from(sellers);
        await transporter.sendMail({
            to: req.user.email,
            subject: `Ваше замовлення ${order.id} отримано продавцями`,
            html: `
                <h1>Деталі замовлення</h1>
                <table>
                    <tr>
                        <th>Фото</th>
                        <th>Назва товару</th>
                        <th>Кількість</th>
                        <th>Ціна</th>
                        <th>Продавець</th>
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

module.exports = {
    createOrder,
    deleteOrder,
    getOrder,
    getUserOrders,
    getSellerOrders
};


// const createOrder = async (req, res) => {
//     const { items } = req.body;
//     try {
//         let total = 0;
//         let orderDetails = '';
//         let sellers = new Set();

//         for (let item of items) {
//             const product = await Product.findByPk(item.product_id);
//             if (!product) {
//                 return res.status(404).json({ message: `Product with id ${item.product_id} not found` });
//             }
//             if (product.stock < item.quantity) {
//                 return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Only ${product.stock} items left.` });
//             }
//             total += product.price * item.quantity;
//             orderDetails += `
//                 <tr>
//                     <td><img src="${product.image}" alt="${product.name}" width="50"/></td>
//                     <td>${product.name}</td>
//                     <td>${item.quantity}</td>
//                     <td>${product.price}</td>
//                 </tr>
//             `;

//             const seller = await User.findByPk(product.user_id, { attributes: ['email'] });
//             if (seller) {
//                 sellers.add(seller.email);
//             }
//         }

//         if (sellers.size === 0) {
//             return res.status(404).json({ message: 'No sellers found for the provided products' });
//         }

//         const order = await Order.create({
//             user_id: req.user.id,
//             total
//         });

//         for (let item of items) {
//             const product = await Product.findByPk(item.product_id);
//             await OrderItem.create({
//                 order_id: order.id,
//                 product_id: item.product_id,
//                 quantity: item.quantity,
//                 price: product.price * item.quantity
//             });
//             await product.update({ stock: product.stock - item.quantity });
//         }

//         console.log('User Email:', req.user.email);
//         console.log('Seller Emails:', Array.from(sellers));

//         const sellerEmailsArray = Array.from(sellers);
//         await transporter.sendMail({
//             to: req.user.email,
//             subject: `Ваше замовлення ${order.id} отримано продавцями`,
//             html: `
//                 <h1>Деталі замовлення</h1>
//                 <table>
//                     <tr>
//                         <th>Фото</th>
//                         <th>Назва товару</th>
//                         <th>Кількість</th>
//                         <th>Ціна</th>
//                     </tr>
//                     ${orderDetails}
//                 </table>
//                 <p>Загальна сума: ${total}</p>
//             `
//         });

//         res.status(201).json({ message: 'Order created successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

const deleteOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByPk(id);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const orderItems = await OrderItem.findAll({ where: { order_id: id } });

        for (let item of orderItems) {
            const product = await Product.findByPk(item.product_id);
            await product.update({ stock: product.stock + item.quantity });
        }

        await OrderItem.destroy({ where: { order_id: id } });
        await Order.destroy({ where: { id } });

        res.status(200).json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getOrder = async (req, res) => {
    const { id } = req.params;
    try {
        const order = await Order.findByPk(id, {
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ]
        });
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            where: { user_id: req.user.id },
            include: [
                {
                    model: OrderItem,
                    include: [Product]
                }
            ]
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSellerOrders = async (req, res) => {
    try {
        const sellerOrders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            where: { user_id: req.user.id },
                            include: [{ model: User, as: 'seller', attributes: ['name', 'email', 'phone'] }]
                        }
                    ]
                },
                {
                    model: User,
                    as: 'buyer',
                    attributes: ['name', 'email', 'phone']
                }
            ]
        });

        if (sellerOrders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        const ordersWithBuyerInfo = sellerOrders.map(order => ({
            order_id: order.id,
            buyer_name: order.buyer.name,
            buyer_email: order.buyer.email,
            buyer_phone: order.buyer.phone,
            products: order.OrderItems.map(item => ({
                product_name: item.Product.name,
                product_price: item.Product.price,
                product_image: item.Product.image,
                quantity: item.quantity
            }))
        }));

        res.json(ordersWithBuyerInfo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    createOrder,
    deleteOrder,
    getOrder,
    getUserOrders,
    getSellerOrders
};
