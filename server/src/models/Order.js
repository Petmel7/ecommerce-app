// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./User');
// const Product = require('./Product');

// const Order = sequelize.define('order', {
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
//     timestamps: false
// });

// const OrderItem = sequelize.define('Order_items', {
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
//     timestamps: false
// });

// Order.belongsTo(User, { foreignKey: 'user_id' });
// Order.hasMany(OrderItem, { foreignKey: 'order_id' });
// OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
// OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

// module.exports = { Order, OrderItem };


const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');
const Product = require('./Product');

const Order = sequelize.define('orders', {
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
    timestamps: false
});

const OrderItem = sequelize.define('order_items', {
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
    timestamps: false
});

Order.belongsTo(User, { foreignKey: 'user_id' });
Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = { Order, OrderItem };
