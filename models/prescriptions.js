const Sequelize = require("sequelize");
const db = require("../utils/db");

const prescriptions = db.define("prescriptions",{
    prescription_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appointment_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    doctor_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    user_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
    },
    date: {
        type: Sequelize.DATE,
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    description : { 
        type: Sequelize.TEXT,
        allowNull: false,
    },
})


module.exports = {
    prescriptions,
}