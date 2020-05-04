const Sequelize = require("sequelize");
const db = require("../utils/db");

const appointments = db.define(
  "appointments",
  {
    doctor_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    start_time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    end_time: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    date: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    period: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = appointments;
