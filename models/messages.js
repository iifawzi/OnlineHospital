const Sequelize = require("sequelize");
const db = require("../utils/db");


const messages = db.define("messages",{
    message_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
    },
    phone_number: {
        type: Sequelize.STRING,
        allowNull: false
    },
    message: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    message_date: {
        type: Sequelize.DATE,
        allowNull: false,
    },
    type: {
        type: Sequelize.ENUM("file","message","image"),
    }
})


module.exports = {
messages
}