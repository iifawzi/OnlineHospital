const Sequelize = require("sequelize");
const db = require("../utils/db");


const users = db.define('users',{
phone_number: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
username: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
password: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
province: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
is_activited: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
},
role: {
    type: Sequelize.DataTypes.ENUM('user', 'admin','doctor'),
    allowNull: false,
},
},{
    freezeTableName: true,
    timestamps: false
})

module.exports = users;