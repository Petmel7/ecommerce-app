
const { Order, OrderItem } = require('../models/Order');
const User = require('../models/User');
const Product = require('../models/Product');
const transporter = require('../config/emailConfig');

// const createOrder = async (req, res) => {
//     const { items } = req.body; // items - це масив з об'єктами { product_id, quantity }
//     try {
//         let total = 0;
//         let orderDetails = '';
//         let sellers = new Set();

//         // Перевірка наявності достатнього stock і підрахунок загальної суми замовлення
//         for (let item of items) {
//             const product = await Product.findByPk(item.product_id);
//             if (!product) {
//                 return res.status(404).json({ message: `Product with id ${item.product_id} not found` });
//             }
//             if (product.stock < item.quantity) {
//                 return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Only ${product.stock} items left.` });
//             }
//             if (!product.user_id) {
//                 return res.status(400).json({ message: `Product with id ${item.product_id} does not have an associated seller` });
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

//             // Зберігання електронних адрес продавців
//             const seller = await User.findByPk(product.user_id, { attributes: ['email'] });
//             if (seller) {
//                 sellers.add(seller.email);
//             }
//         }

//         // Перевірка наявності продавців
//         if (sellers.size === 0) {
//             return res.status(404).json({ message: 'No sellers found for the provided products' });
//         }

//         // Створення нового замовлення
//         const order = await Order.create({
//             user_id: req.user.id,
//             total
//         });

//         // Додавання деталей замовлення і оновлення stock
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

//         // Перевірка та логування змінних
//         console.log('User Email:', req.user.email);
//         console.log('Seller Emails:', Array.from(sellers));

//         // Відправка листа з деталями замовлення
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

// const deleteOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const order = await Order.findByPk(id);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         // Видалення деталей замовлення
//         await OrderItem.destroy({ where: { order_id: id } });
//         // Видалення замовлення
//         await Order.destroy({ where: { id } });

//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const order = await Order.findByPk(id, {
//             include: [
//                 {
//                     model: OrderItem,
//                     include: [Product]
//                 }
//             ]
//         });
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getUserOrders = async (req, res) => {
//     try {
//         const orders = await Order.findAll({
//             where: { user_id: req.user.id },
//             include: [
//                 {
//                     model: OrderItem,
//                     include: [Product]
//                 }
//             ]
//         });
//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     createOrder,
//     deleteOrder,
//     getOrder,
//     getUserOrders
// };




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

// const deleteOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const order = await Order.findByPk(id);
//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         const orderItems = await OrderItem.findAll({ where: { order_id: id } });

//         for (let item of orderItems) {
//             const product = await Product.findByPk(item.product_id);
//             await product.update({ stock: product.stock + item.quantity });
//         }

//         await OrderItem.destroy({ where: { order_id: id } });
//         await Order.destroy({ where: { id } });

//         res.status(200).json({ message: 'Order deleted successfully' });
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const order = await Order.findByPk(id, {
//             include: [
//                 {
//                     model: OrderItem,
//                     include: [Product]
//                 }
//             ]
//         });

//         console.log('getOrder!!!!', order);

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getUserOrders = async (req, res) => {
//     try {
//         const orders = await Order.findAll({
//             where: { user_id: req.user.id },
//             include: [
//                 {
//                     model: OrderItem,
//                     include: [Product]
//                 }
//             ]
//         });

//         console.log('getUserOrders++++', orders);

//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// const getSellerOrders = async (req, res) => {
//     try {
//         const orders = await Order.findAll({
//             include: [
//                 {
//                     model: OrderItem,
//                     include: [
//                         {
//                             model: Product,
//                             where: { user_id: req.user.id },
//                             include: [{ model: User, as: 'seller', attributes: ['name', 'email'] }]
//                         }
//                     ]
//                 },
//                 {
//                     model: User,
//                     as: 'user',
//                     attributes: ['name', 'email']
//                 }
//             ]
//         });

//         console.log('getSellerOrders>>>', orders);

//         if (!orders.length) {
//             return res.status(404).json({ message: 'No orders found' });
//         }

//         res.json(orders);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

// module.exports = {
//     createOrder,
//     deleteOrder,
//     getOrder,
//     getUserOrders,
//     getSellerOrders
// };




const createOrder = async (req, res) => {
    const { items } = req.body;
    try {
        let total = 0;
        let orderDetails = '';
        let sellers = new Set();

        for (let item of items) {
            const product = await Product.findByPk(item.product_id);
            if (!product) {
                return res.status(404).json({ message: `Product with id ${item.product_id} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for product ${product.name}. Only ${product.stock} items left.` });
            }
            total += product.price * item.quantity;
            orderDetails += `
                <tr>
                    <td><img src="${product.image}" alt="${product.name}" width="50"/></td>
                    <td>${product.name}</td>
                    <td>${item.quantity}</td>
                    <td>${product.price}</td>
                </tr>
            `;

            const seller = await User.findByPk(product.user_id, { attributes: ['email'] });
            if (seller) {
                sellers.add(seller.email);
            }
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

// const getOrder = async (req, res) => {
//     const { id } = req.params;
//     try {
//         const order = await OrderItem.findAll({ where: { product_id: id } });

//         console.log('getOrder!!!!', order);

//         if (!order) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.json(order);
//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// };

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

        console.log('getUserOrders++++', orders);

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getSellerOrders = async (req, res) => {
    try {
        const orders = await Order.findAll({
            include: [
                {
                    model: OrderItem,
                    include: [
                        {
                            model: Product,
                            where: { user_id: req.user.id },
                            include: [{ model: User, as: 'seller', attributes: ['name', 'email'] }]
                        }
                    ]
                },
                {
                    model: User,
                    as: 'user',
                    attributes: ['name', 'email']
                }
            ]
        });

        console.log('getSellerOrders>>>', orders);

        if (!orders.length) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
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