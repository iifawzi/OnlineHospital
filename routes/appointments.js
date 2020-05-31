const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const appointmentsController = require("../controllers/appointments");


router.post("/addAppointment",isAuth(["admin","user"]),validate(validationSchemas.addAppointment,"body"),appointmentsController.addAppointment);
router.post("/addConfirmedAppointment",isAuth(["admin"]),validate(validationSchemas.addConfirmedAppointment,"body"),appointmentsController.addConfirmedAppointment);
router.post("/getUserApps",isAuth(["admin"]),validate(validationSchemas.getUserApps,"body"),appointmentsController.getUserApps);
router.post("/getDocApps",isAuth(["admin"]),validate(validationSchemas.getDocApps,"body"),appointmentsController.getDocApps);
// router.post("/docAppsByDate",isAuth(["admin","doctor"]),validate(validationSchemas.docAppsByDate,"body"),appointmentsController.docAppsByDate);
router.patch("/cancelAppointment",isAuth(["admin","user"]),validate(validationSchemas.cancelApp,"body"),appointmentsController.cancelAppointment);
router.patch("/confirmAppointment",isAuth(["admin","user"]),validate(validationSchemas.confirmApp,"body"),appointmentsController.confirmAppointment);
module.exports = router;