const Sequelize = require("sequelize");
const db = require("../utils/db");

const certifications = db.define("certifications",{
cert_id:{
    type:Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
},
doctor_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
},
title:{
    type:Sequelize.STRING,
    allowNull:false,
},
description: {
    type:Sequelize.STRING,
    allowNull: false,
},
cert_file:{
    type:Sequelize.STRING,
    allowNull:true,
}
},{
    freezeTableName: true,
    timestamps: false,
})


module.exports = {
    certifications
}