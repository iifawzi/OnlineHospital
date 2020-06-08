const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError,ErrorHandler} = require("../middleware/error");

const prescriptions = db.define("prescriptions",{
    prescription_id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    room_id: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    prescription: {
        type: Sequelize.TEXT,
        allowNull: false,
    },
    diagnose : { 
        type: Sequelize.TEXT,
        allowNull: false,
    },
}, {
    indexes: [
        {
            fields: ['room_id'],
          },
      ],
})


// METHODS : 
const getPrescription = async function(room_id,res){
    try {
        const prescription = prescriptions.findOne({where: {room_id}});
        return prescription;
    }catch(err){
        handleError(err,res);
    }
}

const createPrescription = async function(data, res){
    try {
        const prescription = await prescriptions.create(data);
        return prescription;
    }catch(err){
        handleError(err,res);
    }
};

const prescriptionUpdate = async function(data,res){
    try{
        const prescription = await getPrescription(data.room_id);
        delete data.room_id;
        if (prescription){
            for (let key in data){
                prescription[key] = data[key];
            }
            await prescription.save();
            return prescription;
        }else {
            throw new ErrorHandler(404,"prescription is not found");
        }
    }catch(err){
handleError(err,res);
    }
  
};

module.exports = {
    prescriptions,
    createPrescription,
    getPrescription,
    prescriptionUpdate
}
