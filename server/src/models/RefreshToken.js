// const { DataTypes } = require('sequelize');
// const sequelize = require('../config/db');
// const User = require('./User');

// const RefreshToken = sequelize.define('RefreshToken', {
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
//     token: {
//         type: DataTypes.STRING,
//         allowNull: false
//     }
// }, {
//     timestamps: false,
//     tableName: 'refresh_tokens'
// });

// RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

// module.exports = RefreshToken;






// server/src/models/RefreshToken.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const RefreshToken = sequelize.define('RefreshToken', {
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
    timestamps: false,
    tableName: 'refresh_tokens'
});

RefreshToken.belongsTo(User, { foreignKey: 'user_id' });

module.exports = RefreshToken;
