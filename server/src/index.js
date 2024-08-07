
// server/src/index.js
const express = require('express');
const dotenv = require('dotenv');
const path = require('path');
// dotenv.config({ path: path.resolve(__dirname, '../.env') });
const cors = require('cors'); // Додано
const session = require('express-session');
const passport = require('./config/passport'); // Переконайтеся, що файл passport.js налаштовано
const sequelize = require('./config/db');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const orderRoutes = require('./routes/orderRoutes');
const errorHandler = require('./utils/errorHandler');
const cron = require('node-cron');
const { deleteOldRefreshTokens } = require('./controllers/userController');

dotenv.config({ path: path.resolve(__dirname, '../.env') });

console.log('DB_HOST:', process.env.DB_HOST);
console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '(none)');
console.log('DB_NAME:', process.env.DB_NAME);
console.log('JWT_SECRET:', process.env.JWT_SECRET);

const app = express();

// Додано для використання CORS
app.use(cors());
app.use(express.json());
app.use(session({
    secret: process.env.SESSION_SECRET || 'default_session_secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Якщо ви використовуєте HTTPS, змініть це на true
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/uploads', express.static(path.join(__dirname, '../uploads'))); // Для обробки зображень

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

// Синхронізація моделей з базою даних
sequelize.sync().then(() => {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});
