const Sequelize = require("sequelize");
const db = require("../utils/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const config = require("config");

const users = db.define(
  "users",
  {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    phone_number: {
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
    birth_date: {
      type: Sequelize.DATEONLY,
      allowNull: false,
    },
    weight: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    height: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    bmi: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    fb_token_id: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    role: {
      type: Sequelize.DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);

// Methods:
//     --- CRUD --
// Creating new user
const createUser = async function (body) {
  const user = await users.create({ ...body });
  return user;
};
// DELETE USER BY PHONE_NUMBER
const deletedUser = async function (phone_number) {
  const user = await users.destroy({ where: { phone_number } });
  return user;
};
//     --- END CRUD --

// Check if phone number exits:
const checkIfPhoneExist = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  return user;
};

// Generate token:
const genToken = function (phone_number, userRole) {
  const encData = {
    phone_number,
    userRole,
  };

            // data to be encrypted in the JSONWEBTOKEN.
  return jwt.sign(encData, config.get("jwt.secret"), {
    expiresIn: config.get("jwt.expiresIn"),
  });
};

// FIREBASE RELATED FUNCTIONS 
  // UPDATE USER'S TOKEN ID
  const updateFirebaseToken = function (userObject,new_token){
    userObject.fb_token_id = new_token;
    userObject.save();
    return userObject;
  }

module.exports = {
  users,
  checkIfPhoneExist,
  createUser,
  genToken,
  deletedUser,
  updateFirebaseToken,
};
