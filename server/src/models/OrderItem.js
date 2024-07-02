// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const Order = require('./Order');
// const Product = require('./Product');

// const OrderItem = sequelize.define('OrderItem', {
//     id: {
//         type: DataTypes.INTEGER,
//         autoIncrement: true,
//         primaryKey: true
//     },
//     order_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: Order,
//             key: 'id'
//         },
//         allowNull: false
//     },
//     product_id: {
//         type: DataTypes.INTEGER,
//         references: {
//             model: Product,
//             key: 'id'
//         },
//         allowNull: false
//     },
//     quantity: {
//         type: DataTypes.INTEGER,
//         allowNull: false
//     },
//     price: {
//         type: DataTypes.FLOAT,
//         allowNull: false
//     }
// }, {
//     timestamps: false,
//     tableName: 'order_items'
// });

// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
// OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// module.exports = OrderItem;


// server/src/models/OrderItem.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Order = require('./Order');
const Product = require('./Product');

const OrderItem = sequelize.define('OrderItem', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Order,
            key: 'id'
        },
        allowNull: false
    },
    product_id: {
        type: DataTypes.INTEGER,
        references: {
            model: Product,
            key: 'id'
        },
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    }
}, {
    timestamps: false,
    tableName: 'order_items'
});

OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = OrderItem;




