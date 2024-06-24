const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const RefreshToken = sequelize.define('Refresh_tokens', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    user_id: {
        type: DataTypes.INTEGER,
        references: {
            model: User,
            key: 'id'
        },
        allowNull: false
    },
    token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    timestamps: false
});

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = RefreshToken;
