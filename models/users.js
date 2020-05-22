const Sequelize = require("sequelize");
const db = require("../utils/db");

const users = db.define(
  "users",
  {
    user_id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    phone_number: {
      type: Sequelize.STRING(255),
      allowNull: false,
      unique: true,
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
    blocked: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    role: {
      type: Sequelize.DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
  },
  {
    indexes: [
      {
        unique: true,
        fields: ["phone_number"],
      },
    ],
    freezeTableName: true,
    timestamps: false,
  }
);

// Functions:
const createUser = async function (body) {
  const user = await users.create({ ...body });
  return user;
};
const deleteUser = async function (phone_number) {
  const user = await users.destroy({ where: { phone_number } });
  return user;
};
const checkIfPhoneExist = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  return user;
};
// UPDATE USER'S FIREBASE TOKEN ID
const updateFirebaseToken = async function (userObject, new_token) {
  userObject.fb_token_id = new_token;
  await userObject.save();
  return userObject;
};

// Block user:
const blockUser = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  user.blocked = true;
  await user.save();
  return user;
};

module.exports = {
  users,
  checkIfPhoneExist,
  createUser,
  deleteUser,
  updateFirebaseToken,
  blockUser,
};
