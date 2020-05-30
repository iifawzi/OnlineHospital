const Sequelize = require('sequelize');
const db = require('../utils/db');
const {handleError} = require("../middleware/error");

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
    phone_number: {
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
    indexes: [
        {
            fields: ["phone_number"],
            unique: true,
          },
      ],
      freezeTableName: true,
      timestamps: false,
},{
    freezeTableName: true,
    timestamps: false,
})

// Methods: 

const checkAdminExist = async function (phone_number,res){
    try {
        const admin = await admins.findOne({where:{phone_number}});
        return admin;
    }catch(err){
        handleError(err,res);
    }
}
const createAdmin = async function (body,res){
    try {
        const admin =  await admins.create(body);
        return admin;
    }catch(err){
        handleError(err,res);
    }
}
const deleteAdmin = async function (phone_number) {
    const admin = await admins.destroy({ where: { phone_number } });
    return admin;
  };

module.exports = {
    admins,
    checkAdminExist,
    createAdmin,
    deleteAdmin,
};


