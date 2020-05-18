const Sequelize = require('sequelize');
const db = require('../utils/db');


const admins = db.define('admins',{
    admin_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    username: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type:Sequelize.ENUM('admin','superadmin'),
        allowNull: false,
        defaultValue: "admin",
    }
},{
    freezeTableName: true,
    timestamps: false,
})


module.exports = admins;