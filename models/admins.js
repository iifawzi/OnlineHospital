const Sequelize = require('sequelize');
const db = require('../utils/db');
const jwt = require("jsonwebtoken");
const config = require("config");

const admins = db.define('admins',{
    admin_id:{
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    name:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    username: {
        type:Sequelize.STRING,
        allowNull: false,
    },
    password:{
        type:Sequelize.STRING,
        allowNull: false,
    },
    role: {
        type:Sequelize.ENUM('admin','superadmin'),
        allowNull: false,
        defaultValue: "admin",
    }
},{
    freezeTableName: true,
    timestamps: false,
})

// Methods: 

const checkAdminExist = async function (username){
    const admin = await admins.findOne({where:{username}});
    return admin;
}
const createAdmin = async function (body){
    const admin =  await admins.create({...body});
    return admin;
}
const deleteAdmin = async function (username) {
    const admin = await admins.destroy({ where: { username } });
    return admin;
  };

  const genToken = function (username, userRole) {
    const encData = {
      username,
      userRole,
    };
    // data to be encrypted in the JSONWEBTOKEN.
    return jwt.sign(encData, config.get("jwt.secret"), {
      expiresIn: config.get("jwt.expiresIn"),
    });
  };
module.exports = {
    admins,
    checkAdminExist,
    createAdmin,
    deleteAdmin,
    genToken,
};


