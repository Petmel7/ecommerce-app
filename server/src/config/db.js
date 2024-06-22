// // server/src/config/db.js
// const mysql = require('mysql2');

// console.log('DB_HOST:', process.env.DB_HOST);
// console.log('DB_USER:', process.env.DB_USER);
// console.log('DB_PASSWORD:', process.env.DB_PASSWORD ? '******' : '(none)');
// console.log('DB_NAME:', process.env.DB_NAME);
// console.log('JWT_SECRET:', process.env.JWT_SECRET);

// const pool = mysql.createPool({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD || null,
//     database: process.env.DB_NAME,
// });

// module.exports = pool.promise();


const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: console.log
});

module.exports = sequelize;
