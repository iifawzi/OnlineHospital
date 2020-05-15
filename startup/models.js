require("../utils/db");
const { users } = require("../models/users");
const {doctors} = require("../models/doctors");
const {slots} = require("../models/slots");
const {appoitnemnts} = require("../models/appointments");
const {prescriptions} = require("../models/prescriptions");
const {diagnosis} = require("../models/diagnosis");
const {messages} = require("../models/messages");
const {rates} = require("../models/rates");
// // Refs:
// slots.belongsTo(users, {
//   foreignKey: "doctor_id",
//   onDelete: "CASCADE",
//   onUpdate: "NO ACTION",
// });
// appointments.belongsTo(users, {
//   foreignKey: "doctor_id",
//   onDelete: "CASCADE",
//   onUpdate: "NO ACTION",
// });
// appointments.belongsTo(users, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
//   onUpdate: "NO ACTION",
// });
// prescription.belongsTo(users, {
//   foreignKey: "doctor_id",
//   onDelete: "CASCADE",
//   onUpdate: "NO ACTION",
// });
// prescription.belongsTo(users, {
//   foreignKey: "user_id",
//   onDelete: "CASCADE",
//   onUpdate: "NO ACTION",
// });