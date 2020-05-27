const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError,ErrorHandler} = require("../middleware/error");

const slots = db.define("slots",{
    slot_id: {
        type:Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    doctor_id: {
        type:Sequelize.INTEGER,
        allowNull: false,
        references: {    
            model: 'doctors',
            key: 'doctor_id'
          },
          onDelete: "CASCADE",
    },
    day: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    start_time: {
        type:Sequelize.TIME,
        allowNull:false,
    },
    end_time: {
        type:Sequelize.TIME,
        allowNull: false,
    },
    slot_time:{
        type:Sequelize.TIME,
        allowNull: false,
    },
    available: {
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
},{
    indexes: [
        {
            fields: ["available","day","doctor_id"],
          },
      ],
      freezeTableName: true,
      timestamps: false,
}
)


const addSlot = async (data)=>{
  const slot = await slots.create(data);
  return slot;
}

const deleteSlot = async (data)=>{
    const slot = await slots.destroy({where:{doctor_id}});
    return slot;
  }
  

const doctorDays = async(doctor_id)=>{ // this will return the days which doctor working in:
    const days = await slots.findAll({where:{doctor_id,available: true},attributes: ['day'], group: ['day']});
    return days;
}


// ON slots.slot_id = apps.slot_id => will return all the records in slots table with null for unmatched in appointments table. 
// apps.date = `` => will help us to return everyting in the slots model, with null if date not registerd in right model
// apps.appointment_status != 'canceled` => will help us to return all the records in slots model, with null for the records which canceled in the appointments model. 
// WHERE => filtering the returned data, get specific doctor id, for specific day, where the right table `appointments` slot_id equals null (to match the above conditions )

const getDocOpenSlots = async function(info){ // this api will return the slots which are allowed to be preserved: 
    const day = info.day;
    const doctor_id = info.doctor_id;
    const date = info.date;
    const slots =  await db.query("SELECT slots.* FROM slots LEFT JOIN appointments apps ON slots.slot_id = apps.slot_id && apps.date = ? && apps.appointment_status != 'canceled' WHERE slots.doctor_id = ? && slots.day = ? && slots.available = 1 && apps.slot_id is null ",{
        replacements: [date,doctor_id,day],
        type: Sequelize.QueryTypes.SELECT,
    });
    return slots;
}

const getDocSlots = async(doctor_id)=>{ // this end point for admins: ( will return all slots of specific doctor):
    const docSlots = await slots.findAll({where: {doctor_id}, order: [ ['slot_id', 'ASC']],});
    return docSlots;
}
module.exports = {
    slots,
    addSlot,
    doctorDays,
    deleteSlot,
    getDocOpenSlots,
    getDocSlots
}