const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const slotsController = require("../controllers/slots");


router.post("/addSlot",isAuth(["admin"]),validate(validationSchemas.addSlot,"body"),slotsController.addDocSlot);
router.post("/getDoctorDays",isAuth(["admin","doctor"]),slotsController.getDoctorDays);
router.post("/getOpenSlots",isAuth(["user","admin"]),validate(validationSchemas.getOpenSlots,"body"),slotsController.getOpenSlots);
router.patch("/updateSlot",isAuth(["admin"]),validate(validationSchemas.updateSlot,"body"),slotsController.updateSlot);


module.exports = router;