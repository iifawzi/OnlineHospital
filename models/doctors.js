const Sequelize = require("sequelize");
const db = require("../utils/db");



const doctors = db.define("doctors",{
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
    days_of_week:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    time_slot_per_client:{
        type:Sequelize.STRING,
        allowNull: false,
    },
},{
    freezeTableName: true,
    timestamps: false
})
module.exports = doctors;