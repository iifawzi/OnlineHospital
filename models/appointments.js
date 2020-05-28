const Sequelize = require("sequelize");
const db = require("../utils/db");
const { handleError, ErrorHandler } = require("../middleware/error");



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
// TODO::later just REMOVE CASCADE

},
user_id:{
    type:Sequelize.INTEGER,
    allowNull: false,
    references: {    
        model: 'users',
        key: 'user_id'
      },
      onDelete: "CASCADE", // For testing reasons,
// TODO::later just REMOVE CASCADE
},
date: {
    type:Sequelize.STRING,
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
      freezeTableName: true,
      timestamps: true,
}
)



const addNewAppointment = async function(data,res){
    try {
        const newAppointment = await appointments.create(data);
        return newAppointment;
    }catch(err){
        handleError(err,res);
    }

}

const deleteAppointment = async function(appointment_id){
    const deleted = await appointments.destroy(appointment_id);
    return deleted;
}

const userApps = async function(user_id,res){
    try {
        const appointments =  await db.query("SELECT apps.appointment_id,docs.first_name,docs.last_name,cats.ar,cats.en,apps.appointment_status,slots.start_time,slots.end_time FROM appointments apps INNER JOIN slots ON apps.slot_id = slots.slot_id INNER JOIN doctors docs ON slots.doctor_id = docs.doctor_id INNER JOIN categories cats ON cats.category_id = docs.category_id WHERE apps.user_id = ?",{
            replacements: [user_id],
            type: Sequelize.QueryTypes.SELECT,
        });
        return appointments;
    }catch(err){
        handleError(err,res);
    }
}

module.exports = { 
    appointments,
    addNewAppointment,
    deleteAppointment,
    userApps
}