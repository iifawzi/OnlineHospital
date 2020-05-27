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



const addNewAppointment = async function(data){
    const newAppointment = await appointments.create(data);
    return newAppointment;
}

const deleteAppointment = async function(appointment_id){
    const deleted = await appointments.destroy(appointment_id);
    return deleted;
}

// ON slots.slot_id = apps.slot_id => will return all the records in slots table with null for unmatched in appointments table. 
// apps.date = `` => will help us to return everyting in the slots model, with null if date not registerd in right model
// apps.appointment_status != 'canceled` => will help us to return all the records in slots model, with null for the records which canceled in the appointments model. 
// WHERE => filtering the returned data, get specific doctor id, for specific day, where the right table `appointments` slot_id equals null (to match the above conditions )

const getDocAppointments = async function(info){
    const day = info.day;
    const doctor_id = info.doctor_id;
    const date = info.date;
    const appointments =  await db.query("SELECT slots.* FROM slots LEFT JOIN appointments apps ON slots.slot_id = apps.slot_id && apps.date = ? && apps.appointment_status != 'canceled' WHERE slots.doctor_id = ? && slots.day = ? && slots.available = 1 && apps.slot_id is null ",{
        replacements: [date,doctor_id,day],
        type: Sequelize.QueryTypes.SELECT,
    });
    return appointments;
}

module.exports = { 
    appointments,
    addNewAppointment,
    deleteAppointment,
    getDocAppointments
}