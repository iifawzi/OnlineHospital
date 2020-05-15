const Sequelize = require("sequelize");
const db = require("../utils/db");



const appointments = db.define("appointments",{

appointment_id : {
    type:Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
},
slot_id: {
    type: Sequelize.INTEGER,
    allowNull: false,
},
user_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
},
date: {
    type:Sequelize.DATE,
    allowNull:false,
},
appointment_status: {
    type: Sequelize.ENUM("upcoming","running","finished","canceled"),
    allowNull: false,
}
})


module.exports = { 
    appointments,
}