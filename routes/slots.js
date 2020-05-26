const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const slotsController = require("../controllers/slots");


router.post("/addSlot",isAuth(["admin"]),validate(validationSchemas.addSlot,"body"),slotsController.addDocSlot);
router.post("/getDoctorDays",isAuth(["user","doctor",'admin']),validate(validationSchemas.getDoctorDays,"body"),slotsController.getDoctorDays);



module.exports = router;