const Sequelize = require("sequelize");
const db = require("../utils/db");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const config = require("config");

const users = db.define('users',{
phone_number: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
username: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
first_name: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
last_name: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
password: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
province: {
    type: Sequelize.STRING(255),
    allowNull: false,
},
is_activited: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: 0,
},
role: {
    type: Sequelize.DataTypes.ENUM('user', 'admin','doctor'),
    allowNull: false,
    defaultValue: "user",
},
},{
    freezeTableName: true,
    timestamps: false
})

// Methods: 

// Check if user exists: 
const checkIfUserExist = async function(username){
        const user = await users.findOne({where:{username}});
        return user;
};

// Check if phone number exits:
const checkIfPhoneExist = async function(phone_number){
const user = await users.findOne({where:{phone_number}});
return user;
};

// Creating new user
const createUser = async function(body){
const user = await users.create({...body});
return user;
}

// Hashing the password
const hashPassword = async function(password){
       const hashed = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
       return hashed;
}

// Verify the password 
const verifyPassword = async function(password,dbPass){
    return  bcrypt.compare(password,dbPass);
}

// Generate token: 
const genToken = function(username,userRole){
    const encData = {
        username,
        userRole,
    };

     // data to be encrypted in the JSONWEBTOKEN.
    return jwt.sign(encData,config.get("jwt.secret"),{
    expiresIn: config.get("jwt.expiresIn")
    });
}

const signinCheck = function(username,password){
  const user =  users.findOne({where:{username}});
return user;
};

module.exports = {
    users,
    checkIfUserExist,
    checkIfPhoneExist,
    createUser,
    hashPassword,
    verifyPassword,
    genToken,
    signinCheck,
};