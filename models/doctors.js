const Sequelize = require("sequelize");
const db = require("../utils/db");
const {handleError} = require("../middleware/error");

const doctors = db.define("doctors",{
    doctor_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    phone_number: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    password: {
        type:Sequelize.STRING,
        allowNull:false,
    },
    first_name: { 
        type:Sequelize.STRING,
        allowNull: false,
    },
    last_name: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    country:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    category_id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        references: {    
            model: 'categories',
            key: 'category_id'
          },
    },
    fb_token_id:{
        type:Sequelize.STRING,
        allowNull:true,
    },
    picture:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    avaliable:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
        defaultValue:false,
    }, 
    price: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    priority: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue:1,
    }
},{
    indexes: [
        {
            fields: ["country"],
          },
        {
            fields: ["category_id","avaliable"],
          },
        {
          unique: true,
          fields: ["phone_number"],
        },
      ],
    freezeTableName: true,
    timestamps: false,
})


const checkDocPhoneExist = async function (phone_number){
const doctor = await doctors.findOne({where:{phone_number}});
return doctor;
}


const checkDocIdExist = async function (doctor_id){
    const doctor = await doctors.findOne({where:{doctor_id}});
    return doctor;
    }


const createNewDoctor = async function (body,res){
    try {
        const doctor =  await doctors.create(body);
        return doctor;
    }catch(err){
        handleError(err,res);
    }
}


const deleteDoctor = async function (phone_number,res) {
    try {
        const doctor = await doctors.destroy({ where: { phone_number } });
        return doctor;
    }catch(err){
        handleError(err,res);
    }
  };


// UPDATE DOCTOR'S FIREBASE TOKEN ID
const updateDoctorFirebaseToken = async function (doctorObject, new_token,res) {
    try {
        doctorObject.fb_token_id = new_token;
        await doctorObject.save();
        return doctorObject;
    }catch(err){
        handleError(err,res);
    }
  };


const  getDoctorsData = async function  (category_id,res){
    try {
        const doctorsData = await doctors.findAll({attributes:{exclude: ['password','fb_token_id','priority']},
        order: [
         ['priority', 'DESC'],
     ],where:{category_id, avaliable: true}}); 
        return doctorsData;
    }catch(err){
        handleError(err,res);
    }
}


// Update Specific Doctor's info : 
const updateDoctor = async function (doctorObject,data,res){
    try {
        for (let key in data){
            doctorObject[key] = data[key];
          }
          await doctorObject.save();
          return doctorObject;
    }catch(err){
        handleError(err,res);
    }
}


// Get Doctors With the categories data for show in control Panel: 
const getDoctorsPanel = async function (res){
    try {
        const doctors =  await db.query("SELECT  docs.doctor_id,docs.phone_number,docs.first_name,docs.last_name,docs.country,docs.avaliable,docs.price ,cats.* FROM `doctors` docs LEFT JOIN `categories` cats ON docs.category_id = cats.category_id ORDER BY docs.doctor_id DESC",{
            type: Sequelize.QueryTypes.SELECT,
        });
        return doctors;
    }catch(err){
        handleError(err,res);
    }
}

const getTokenFromSlot = async function(slot_id){
    const fbToken =  await db.query("SELECT fb_token_id FROM doctors LEFT JOIN slots ON doctors.doctor_id = slots.doctor_id WHERE slot_id = ?",{
        replacements: [slot_id],
        type: Sequelize.QueryTypes.SELECT,
    });
    return fbToken[0].fb_token_id;
}

module.exports = {
    doctors,
    checkDocPhoneExist,
    createNewDoctor,
    updateDoctorFirebaseToken,
    deleteDoctor,
    getDoctorsData,
    updateDoctor,
    checkDocIdExist,
    getDoctorsPanel,
    getTokenFromSlot
}