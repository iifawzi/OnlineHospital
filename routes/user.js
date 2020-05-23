const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const userController = require("../controllers/user");

router.patch("/updateInfo",isAuth(['admin','user']),validate(validationSchemas.updateUser,"body"),userController.updateInfo);
module.exports = router;