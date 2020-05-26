const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const isAuth = require("../middleware/is-auth");
const panelController = require("../controllers/controlPanel");
const router = express.Router();

// Everything Route related to the Control Panel will be listed here: 

// Admin Auth:
router.post("/addAdmin",isAuth(['admin']),validate(validationSchemas.addAdmin,"body"),panelController.addAdmin);
router.post("/signAdmin",validate(validationSchemas.signAdmin,"body"),panelController.signAdmin);
router.post("/checkAdminByToken",isAuth(['admin']),panelController.checkToken);
// Image:
router.post("/addImage",isAuth(['admin','user']),panelController.addImage);
// Doctors:
router.post("/addDoctor",isAuth(['admin']),validate(validationSchemas.addDoctor,"body"),panelController.addDoctor);
router.get("/getDoctors",isAuth(['admin']),panelController.getDoctors);
router.delete("/deleteDoctor",isAuth(['admin']),validate(validationSchemas.deleteDoctor,"body"),panelController.deleteTheDoctor);


// Categories:
router.get("/getCategories",isAuth(['admin']),panelController.getCategories);

// Users:
router.patch("/toggleBlock",isAuth(['admin']),validate(validationSchemas.toggleBlock,"body"),panelController.toggleBlock);

module.exports = router;