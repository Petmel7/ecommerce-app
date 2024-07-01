
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastName: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: true
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для пароля, оскільки користувач може авторизуватися через Google
    },
    emailConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля phone
    },
    phoneConfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmationCode: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля confirmationCode
    },
    googleId: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля googleId
    }
});

module.exports = User;




