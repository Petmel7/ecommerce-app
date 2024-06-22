
// server/src/index.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const cron = require('node-cron');
const { deleteOldRefreshTokens } = require('./controllers/userController');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./utils/errorHandler');

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '(none)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
    res.send('Welcome to the eCommerce API');
});

app.use(errorHandler);

// Запуск задачі кожного дня в 00:00 для видалення старих refresh tokens
cron.schedule('0 0 * * *', async () => {
    await deleteOldRefreshTokens();
    console.log('Scheduled task executed: old refresh tokens deleted');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});




// // server/src/index.js
// const express = require('express');
// const dotenv = require('dotenv');
// const path = require('path');
// dotenv.config({ path: path.resolve(__dirname, '../.env') });

// const sequelize = require('./config/db');
// const productRoutes = require('./routes/productRoutes');
// const userRoutes = require('./routes/userRoutes');
// const orderRoutes = require('./routes/orderRoutes');
// const errorHandler = require('./utils/errorHandler');
// const cron = require('node-cron');
// const { deleteOldRefreshTokens } = require('./controllers/userController');

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '(none)');
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// const app = express();

// app.use(express.json());

// app.use('/api/products', productRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/orders', orderRoutes);

// app.get('/', (req, res) => {
//     res.send('Welcome to the eCommerce API');
// });

// app.use(errorHandler);

// // Запуск задачі кожного дня в 00:00 для видалення старих refresh tokens
// cron.schedule('0 0 * * *', async () => {
//     await deleteOldRefreshTokens();
//     console.log('Scheduled task executed: old refresh tokens deleted');
// });

// // Синхронізація моделей з базою даних
// sequelize.sync().then(() => {
//     const PORT = process.env.PORT || 5000;
//     app.listen(PORT, () => {
//         console.log(`Server running on port ${PORT}`);
//     });
// }).catch(err => {
//     console.error('Unable to connect to the database:', err);
// });

