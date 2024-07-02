// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./User');

// const Order = sequelize.define('Order', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     user_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: User,
//             key: 'id'
//         },
//         allowNull: false
//     },
//     total: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     }
// }, {
//     timestamps: false,
//     tableName: 'orders'
// });

// module.exports = Order;



// server/src/models/Order.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Order = sequelize.define('Order', {
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
    total: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'orders'
});

module.exports = Order;





