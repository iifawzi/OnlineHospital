const Sequelize = require("sequelize");
const db = require("../utils/db");

const slots = db.define("slots",{
    slot_id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    doctor_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    day: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    start_time: {
        type:Sequelize.TIME,
        allowNull:false,
    },
    end_time: {
        type:Sequelize.TIME,
        allowNull: false,
    },
    slot_time:{
        type:Sequelize.TIME,
        allowNull: false,
    },
    available: {
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
})


module.exports = {
    slots,
}