const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const messagesController = require("../controllers/messages");
const bodyParser = require("body-parser");

router.use(
    bodyParser.urlencoded({
      parameterLimit: 100000,
      limit: "50mb",
      extended: true
    })
  );

router.post("/getFinishedMessages", isAuth(['admin','user','doctor']),validate(validationSchemas.getFinishedMessages,"body"),messagesController.finishedMessages)
router.post("/uploadFile",isAuth(['user','doctor']),messagesController.uploadFile);

module.exports = router;