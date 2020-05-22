const Sequelize = require("sequelize");
const db = require("../utils/db");

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
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    sub_category:{
        type:Sequelize.STRING,
        allowNull:true,
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
            fields: ["avaliable"],
          },
        {
          unique: true,
          fields: ["phone_number"],
        },
        {
            fields: ["category","sub_category"],
          },
      ],
    freezeTableName: true,
    timestamps: false,
})


const checkDocPhoneExist = async function (phone_number){
const doctor = await doctors.findOne({where:{phone_number}});
return doctor;
}
const createNewDoctor = async function (body){
    const doctor =  await doctors.create({...body});
    return doctor;
}
const deleteDoctor = async function (phone_number) {
    const doctor = await doctors.destroy({ where: { phone_number } });
    return doctor;
  };
// UPDATE DOCTOR'S FIREBASE TOKEN ID
const updateDoctorFirebaseToken = async function (doctorObject, new_token) {
    doctorObject.fb_token_id = new_token;
    await doctorObject.save();
    return doctorObject;
  };
const  getDoctorsData = async  (req,res,next)=>{
   const doctorsData = await doctors.findAll({attributes:{exclude: ['password','fb_token_id','priority']},
   order: [
    ['priority', 'DESC'],
],}); // later just show the avaliable = true doctors
   return doctorsData;
}
module.exports = {
    doctors,
    checkDocPhoneExist,
    createNewDoctor,
    updateDoctorFirebaseToken,
    deleteDoctor,
    getDoctorsData,
}