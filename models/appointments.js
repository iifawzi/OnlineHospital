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
    references: {    
        model: 'slots',
        key: 'slot_id'
      },
},
user_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {    
        model: 'users',
        key: 'user_id'
      },
},
date: {
    type:Sequelize.DATE,
    allowNull:false,
},
appointment_status: {
    type: Sequelize.ENUM("pending","upcoming","running","finished","canceled"),
    allowNull: false,
}
},{
    indexes: [
        {
            fields: ["slot_id","date","appointment_status"],
          },
          {
            fields: ["user_id","date"],
          },
      ],
},{
    freezeTableName: true,
    timestamps: false,
})


module.exports = { 
    appointments,
}