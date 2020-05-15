const Sequelize = require("sequelize");
const db = require("../utils/db");
const bcrypt = require("bcrypt");
const config = require("config");

const doctors = db.define("doctors",{
    doctor_id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true
    },
    phone_number: {
        type:Sequelize.STRING,
        allowNull: false,
        unique: true
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
    avaliable:{
        type:Sequelize.BOOLEAN,
        allowNull:false,
    }
},{
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
// Hash the Password
const hashPassword = async function (password){
const hashedPassword = await bcrypt.hash(password,config.get("bcrypt.saltRounds"));
return hashedPassword;
};
// Compare Hashed Password:
const compareHashed = async function(password,hashedPassword){
    const compareResult = await bcrypt.compare(password,hashedPassword);
    return compareResult;
}
// UPDATE DOCTOR'S FIREBASE TOKEN ID
const updateDoctorFirebaseToken = async function (doctorObject, new_token) {
    doctorObject.fb_token_id = new_token;
    await doctorObject.save();
    return doctorObject;
  };
  



module.exports = {
    doctors,
    checkDocPhoneExist,
    createNewDoctor,
    hashPassword,
    compareHashed,
    updateDoctorFirebaseToken,
}