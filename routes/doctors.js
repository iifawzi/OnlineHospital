const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const isAuth = require("../middleware/is-auth");
const doctorsController = require("../controllers/doctors");
const router = express.Router();

// Everything Route related to the doctors will be listed here: 


router.post("/getDoctor",isAuth,validate(validationSchemas.getDoctor,"body"),doctorsController.getDoctor);
router.post("/getDoctors",isAuth,doctorsController.getDoctors);

module.exports = router;