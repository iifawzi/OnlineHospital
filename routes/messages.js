const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const messagesController = require("../controllers/messages");


router.post("/getFinishedMessages", isAuth(['admin','user','doctor']),validate(validationSchemas.getFinishedMessages,"body"),messagesController.finishedMessages)
router.post("/uploadFile",isAuth(['admin','user']),messagesController.uploadFile);

module.exports = router;