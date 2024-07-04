
const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'postgres',
    logging: console.log
});

module.exports = sequelize;

// const sequelize = require('./config/db');
// const User = require('./models/User');
// const RefreshToken = require('./models/RefreshToken');
// const Order = require('./models/Order');
// const OrderItem = require('./models/OrderItem');
// const Product = require('./models/Product');

// const syncDatabase = async () => {
//     try {
//         await sequelize.sync({ force: false }); // Використовуйте { force: true }, щоб видалити всі таблиці та створити їх заново
//         console.log('Database synced successfully');
//     } catch (error) {
//         console.error('Error syncing database:', error);
//     }
// };

// syncDatabase();



