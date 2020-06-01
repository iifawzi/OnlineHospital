const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const appointmentsController = require("../controllers/appointments");

// Appoiintments confirm,cancel,add : 
router.post("/addAppointment",isAuth(["admin","user"]),validate(validationSchemas.addAppointment,"body"),appointmentsController.addAppointment);
router.patch("/cancelAppointment",isAuth(["admin","user"]),validate(validationSchemas.cancelApp,"body"),appointmentsController.cancelAppointment);
router.patch("/confirmAppointment",isAuth(["user"]),validate(validationSchemas.confirmApp,"body"),appointmentsController.confirmAppointment);
// For control Panel, to add confirmed Appointment
router.post("/addConfirmedAppointment",isAuth(["admin"]),validate(validationSchemas.addConfirmedAppointment,"body"),appointmentsController.addConfirmedAppointment);
// get user appointments for control panel: 
router.post("/getUserApps",isAuth(["admin"]),validate(validationSchemas.getUserApps,"body"),appointmentsController.getUserApps);
// get user's appointments for users' application: 
router.get("/finishedAppointments",isAuth(["user"]),appointmentsController.finishedAppointments);
router.get("/upcomingAppointments",isAuth(["user"]),appointmentsController.upcomingAppointments);
// get doctor appointments for control Panel
router.post("/getDocApps",isAuth(["admin"]),validate(validationSchemas.getDocApps,"body"),appointmentsController.getDocApps);
// get doctor's appointments for doctors' application: 
router.get("/doctorFinishedAppointments",isAuth(["doctor","admin"]),appointmentsController.doctorFinishedAppointments);
router.get("/doctorUpcomingAppointments",isAuth(["doctor","admin"]),appointmentsController.doctorUpcomingAppointments);
// get doctor appointments by date for doctor's application
router.post("/docAppsByDate",isAuth(["doctor","admin"]),validate(validationSchemas.docAppsByDate,"body"),appointmentsController.docAppsByDate);
// TODO:: ADMIN NOT ALLOWED 
// to check if user's is able to join to specific appointment: 
router.patch("/joinUserToAppointment",isAuth(["user","admin"]),validate(validationSchemas.joinUserAppointment,"body"),appointmentsController.joinUser);
router.patch("/joinDoctorToAppointment",isAuth(["user","admin"]),validate(validationSchemas.joinDoctorAppointment,"body"),appointmentsController.joinDoctor);
// TODO:: ADMIN NOT ALLOWED 
module.exports = router;