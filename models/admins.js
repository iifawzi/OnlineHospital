const Sequelize = require('sequelize');
const db = require('../utils/db');

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

const checkAdminExist = async function (phone_number){
    const admin = await admins.findOne({where:{phone_number}});
    return admin;
}
const createAdmin = async function (body){
    const admin =  await admins.create(body);
    return admin;
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


