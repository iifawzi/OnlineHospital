const Sequelize = require("sequelize");
const db = require("../utils/db");



const rates = db.define("rates",{
    rate_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    rate: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})


module.exports = {
    rates
}