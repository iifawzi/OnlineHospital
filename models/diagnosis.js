const Sequelize = require("sequelize");
const db = require("../utils/db");


const diagnosis = db.define("diagnosis", { 
    diagnose_id: { 
        type: Sequelize.INTEGER,
        autiIncrement: true,
        primaryKey: true,
    },
    appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
    },
    date: {
        type: Sequelize.DATE,
        allowNull: true,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description : {
        type: Sequelize.TEXT, 
        allowNull: false,
    }
})

module.exports = {
    diagnosis,
}