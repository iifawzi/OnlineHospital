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
            fields: ["doctor_id","day","available"],
          },
      ],
},{
    freezeTableName: true,
    timestamps: false,
})


const addSlot = async (data)=>{
  const slot = await slots.create(data);
  return slot;
}

module.exports = {
    slots,
    addSlot
}