const Sequelize = require("sequelize");
const db = require("../utils/db");

const prescription = db.define(
  "prescription",
  {
    doctor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = prescription;
