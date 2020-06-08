const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError} = require("../middleware/error");

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

const createPrescription = async function(data, res){
    try {
        const prescription = await prescriptions.create(data);
        return prescription;
    }catch(err){
        handleError(err,res);
    }

}


module.exports = {
    prescriptions,
    createPrescription
}
