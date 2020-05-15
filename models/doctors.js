const Sequelize = require("sequelize");
const db = require("../utils/db");

const doctors = db.define("doctors",{
    doctor_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    phone_number: {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    username: {
        type:Sequelize.STRING,
        allowNull: false,
        unique:true,
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    first_name: { 
        type:Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    country:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    sub_category:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    avaliable:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
},{
    freezeTableName: true,
    timestamps: false,
})


module.exports = {
    doctors,
}