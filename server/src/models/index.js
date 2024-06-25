const User = require('./User');
const Product = require('./Product');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Визначення асоціацій
User.hasMany(Product, { foreignKey: 'user_id' });
Product.belongsTo(User, { foreignKey: 'user_id', as: 'seller' });

User.hasMany(Order, { foreignKey: 'user_id' });
Order.belongsTo(User, { foreignKey: 'user_id', as: 'buyer' });

Order.hasMany(OrderItem, { foreignKey: 'order_id' });
OrderItem.belongsTo(Order, { foreignKey: 'order_id' });

Product.hasMany(OrderItem, { foreignKey: 'product_id' });
OrderItem.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = {
    User,
    Product,
    Order,
    OrderItem
};

