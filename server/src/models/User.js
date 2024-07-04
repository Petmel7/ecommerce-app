
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    lastname: {
        type: DataTypes.STRING,
        allowNull: true
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
    emailconfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    phone: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля phone
    },
    phoneconfirmed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    confirmationcode: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля confirmationCode
    },
    googleid: {
        type: DataTypes.STRING,
        allowNull: true // Дозволяємо null значення для поля googleId
    }
}, {
    timestamps: false,
    tableName: 'users'
});

module.exports = User;




