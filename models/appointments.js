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
      onDelete: "CASCADE", // For testing reasons,
},
user_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {    
        model: 'users',
        key: 'user_id'
      },
      onDelete: "CASCADE", // For testing reasons,

},
date: {
    type:Sequelize.DATE,
    allowNull:false,
},
appointment_status: {
    type: Sequelize.ENUM("pending","upcoming","running","finished","canceled"),
    allowNull: false,
    defaultValue:"pending",
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



const addNewAppointment = async function(data){
    const newAppointment = await appointments.create(data);
    return newAppointment;
}

const deleteAppointment = async function(appointment_id){
    const deleted = await appointments.destroy(appointment_id);
    return deleted;
}

module.exports = { 
    appointments,
    addNewAppointment,
    deleteAppointment
}