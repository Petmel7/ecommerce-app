// server/src/config/emailConfig.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail', // Використовуйте вашу службу електронної пошти
    auth: {
        user: process.env.EMAIL_USER, // Ваш email
        pass: process.env.EMAIL_PASS  // Ваш пароль
    }
});

module.exports = transporter;



