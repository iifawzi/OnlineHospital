const Sequelize = require("sequelize");
const db = require("../utils/db");
const { handleError } = require("../middleware/error");

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
    money: {
      allowNull: true,
     type: Sequelize.STRING,
    },
    picture: {
      allowNull: true,
     type: Sequelize.STRING,
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
const createUser = async function (body,res) {
  try {
    const user = await users.create(body);
    return user;
  }catch(err){
    handleError(err,res);
  }
};
const deleteUser = async function (phone_number) {
  const user = await users.destroy({ where: { phone_number } });
  return user;
};
const checkIfPhoneExist = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  return user;
};
const checkIfUserExist = async function (user_id) {
  const user = await users.findOne({ where: { user_id } });
  return user;
};
// UPDATE USER'S FIREBASE TOKEN ID
const updateFirebaseToken = async function (userObject, new_token,res) {
  try {
    userObject.fb_token_id = new_token;
    await userObject.save();
    return userObject;
  }catch(err){
    handleError(err,res);
  }
};

// Block user:
const blockUser = async function (phone_number) {
  const user = await users.findOne({ where: { phone_number } });
  user.blocked = true;
  await user.save();
  return user;
};

// update user specific inputs: 
const updateUser = async function (userObject,data,res){
  try {
    for (let key in data){
      userObject[key] = data[key];
    }
    await userObject.save();
    return userObject;
  }catch(err){
   handleError(err,res)
  }
}

module.exports = {
  users,
  checkIfPhoneExist,
  createUser,
  deleteUser,
  updateFirebaseToken,
  blockUser,
  updateUser,
  checkIfUserExist
};
