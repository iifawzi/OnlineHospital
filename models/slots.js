const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError} = require("../middleware/error");
const {cancelApps} = require("../models/appointments")

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
        type:Sequelize.STRING,
        allowNull:false,
    },
    slot_time:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    available: {
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
},{
    indexes: [
        {
            fields: ["doctor_id","day","available",'start_time'],
          },
      ],
      freezeTableName: true,
      timestamps: false,
}
)


const addSlot = async (data,res)=>{ // to add a new slot
    try {
        const slot = await slots.create(data);
        return slot;
    }catch(err){
        handleError(err,res);
    }
}

const deleteSlot = async (slot_id)=>{
    const slot = await slots.destroy({ where: { slot_id } });
    return slot;
  }
  


// ON slots.slot_id = apps.slot_id => will return all the records in slots table with null for unmatched in appointments table. 
// apps.date = `` => will help us to return everyting in the slots model, with null if date not registerd in right model
// apps.appointment_status != 'canceled` => will help us to return all the records in slots model, with null for the records which canceled in the appointments model. 
// WHERE => filtering the returned data, get specific doctor id, for specific day, where the right table `appointments` slot_id equals null (to match the above conditions )
// add 10 min (11 for avoiding seconds) to the current time (to get all slots that's available before 10 minutes of the current time)
// concatenated dates used to let the front-end users able to use different time-zones
const getDocOpenSlots = async function(info,res){ // this api will return the slots which are allowed to be preserved: 
    try {
        const day = info.day;
        const doctor_id = info.doctor_id;
        const date = info.date;
        const slots =  await db.query("SELECT slots.slot_id,slots.doctor_id,slots.day,slots.slot_time, CONCAT(?,'T',slots.start_time,'Z') start_time FROM slots LEFT JOIN appointments apps ON slots.slot_id = apps.slot_id AND apps.date = ? AND apps.appointment_status != 'canceled' WHERE slots.doctor_id = ? AND slots.day = ? AND slots.available = 1 AND apps.slot_id is null ",{
            replacements: [date,date,doctor_id,day],
            type: Sequelize.QueryTypes.SELECT,
        });
        // AND BINARY slots.start_time > BINARY addtime(time(now()), '00:11:00')
        //TODO:: ADD THE MINIMUM TIME TO BE ABLE TO PRESERVE AN APPOINTMENT
        return slots;
    }catch(err){
        handleError(err,res);
    }
}

const doctorDays = async(doctor_id)=>{ // this will return the days which doctor working in:	
    const days = await slots.findAll({where:{doctor_id,available: true},attributes: ['day'], group: ['day']});	
    return days;	
}

const getDocSlots = async(doctor_id,res)=>{ // this end point for admins: ( will return all slots of specific doctor):
    try {
        const docSlots = await slots.findAll({where: {doctor_id}, order: [ ['slot_id', 'ASC']],});
        return docSlots;
    }catch(err){
        handleError(err,res);
    }
}


const slotUpdate = async(data,res)=>{ // this end point for admins: to update an slot
    try {
        const slot_id = data.slot_id;
        const slot = await slots.findOne({where:{slot_id}});
        delete data.slot_id;
        let shouldCancelApps = false;
        const old_status = slot.available;
        
        for (let key in data){
           if (slot[key] != data[key]){
            slot[key] = data[key];
            shouldCancelApps = true;
           }
          }

          if (shouldCancelApps && old_status === true){
              await cancelApps(slot_id);
          }

          await slot.save();
          return slot;
    }catch(err){
        handleError(err,res);
    }

    
    return docSlots;
}

module.exports = {
    slots,
    addSlot,
    deleteSlot,
    getDocOpenSlots,
    getDocSlots,
    slotUpdate,
    doctorDays
}