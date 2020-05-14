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
    username: {
      type: Sequelize.STRING(255),
      allowNull: false,
    },
    password: {
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
    is_activited: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
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
// DELETE USER BY USERNAME
const deletedUser = async function (username) {
  const user = await users.destroy({ where: { username } });
  return user;
};
//     --- END CRUD --

// Check if user exists:
const checkIfUserExist = async function (username) {
  const user = await users.findOne({ where: { username } });
  return user;
};

// Check if phone number exits:
const checkIfPhoneExist = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  return user;
};

// Hashing the password
const hashPassword = async function (password) {
  const hashed = await bcrypt.hash(password, config.get("bcrypt.saltRounds"));
  return hashed;
};

// Verify the password
const verifyPassword = async function (password, dbPass) {
  return bcrypt.compare(password, dbPass);
};

// Generate token:
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

// FIREBASE RELATED FUNCTIONS 
  // UPDATE USER'S TOKEN ID

  const updateFirebaseToken = function (userObject,username,new_token){
    userObject.fb_token_id = new_token;
    userObject.save();
    return userObject;
  }

module.exports = {
  users,
  checkIfUserExist,
  checkIfPhoneExist,
  createUser,
  hashPassword,
  verifyPassword,
  genToken,
  deletedUser,
  updateFirebaseToken,
};
