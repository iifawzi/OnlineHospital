const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const isAuth = require("../middleware/is-auth");
const panelController = require("../controllers/controlPanel");
const router = express.Router();

// Everything Route related to the Control Panel will be listed here: 


router.post("/addDoctor",validate(validationSchemas.addDoctor,"body"),panelController.addDoctor);
router.post("/addAdmin",validate(validationSchemas.addAdmin,"body"),panelController.addAdmin);
router.post("/signAdmin",validate(validationSchemas.signAdmin,"body"),panelController.signAdmin);

module.exports = router;