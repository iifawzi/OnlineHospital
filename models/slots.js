const Sequelize = require("sequelize");
const db = require("../utils/db");



const slots = db.define("slots",{
    doctor_id:{
        type:Sequelize.INTEGER,
        unique : true,
        allowNull: false,
    },
    start_time:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    end_time:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    day:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    slot_time:{
        type:Sequelize.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = slots;