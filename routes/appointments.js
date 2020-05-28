const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const appointmentsController = require("../controllers/appointments");


router.post("/addAppointment",isAuth(["admin"]),validate(validationSchemas.addAppointment,"body"),appointmentsController.addAppointment);
router.post("/getUserApps",isAuth(["admin"]),validate(validationSchemas.getUserApps,"body"),appointmentsController.getUserApps);
router.post("/getDocApps",isAuth(["admin"]),validate(validationSchemas.getDocApps,"body"),appointmentsController.getDocApps);
module.exports = router;