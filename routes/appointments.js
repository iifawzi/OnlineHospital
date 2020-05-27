const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const appointmentsController = require("../controllers/appointments");


router.post("/addAppointment",isAuth(["admin"]),validate(validationSchemas.addAppointment,"body"),appointmentsController.addAppointment);
router.post("/getAppointments",isAuth(["admin","user"]),validate(validationSchemas.getAppointments,"body"),appointmentsController.getAppointments);
// TODO::later just ALLOW FOR USERS
module.exports = router;