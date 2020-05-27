const Sequelize = require("sequelize");
const db = require("../utils/db");

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
module.exports = {
    slots,
    addSlot,
    doctorDays,
    deleteSlot
}