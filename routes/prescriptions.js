const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const prescroptionController = require("../controllers/prescriptions");
const bodyParser = require("body-parser");

router.post("/addPrescription", isAuth(['doctor']),validate(validationSchemas.addPrescription,"body"),prescroptionController.addPrescription);
router.put("/updatePrescription", isAuth(['doctor']),validate(validationSchemas.updatePrescription,"body"),prescroptionController.updatePrescription);
router.post("/getPrescription", isAuth(['doctor','user','admin']),validate(validationSchemas.getPrescription,"body"),prescroptionController.getPrescription);


module.exports = router;