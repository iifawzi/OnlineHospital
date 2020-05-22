const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const isAuth = require("../middleware/is-auth");
const panelController = require("../controllers/controlPanel");
const router = express.Router();

// Everything Route related to the Control Panel will be listed here: 


router.post("/addDoctor",isAuth(['admin']),validate(validationSchemas.addDoctor,"body"),panelController.addDoctor);
router.post("/addImage",isAuth(['admin','user']),panelController.addImage);
router.post("/addAdmin",isAuth(['admin']),validate(validationSchemas.addAdmin,"body"),panelController.addAdmin);
router.post("/signAdmin",validate(validationSchemas.signAdmin,"body"),panelController.signAdmin);
router.post("/checkAdminByToken",isAuth(['admin']),panelController.checkToken);

module.exports = router;