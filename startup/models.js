require("../utils/db");
const { users } = require("../models/users");
const doctors = require("../models/doctors");
const appointments = require("../models/appointments");
const prescription = require("../models/prescription");

// Refs:
doctors.belongsTo(users, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});
appointments.belongsTo(users, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});
appointments.belongsTo(users, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});
prescription.belongsTo(users, {
  foreignKey: "doctor_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});
prescription.belongsTo(users, {
  foreignKey: "user_id",
  onDelete: "CASCADE",
  onUpdate: "NO ACTION",
});