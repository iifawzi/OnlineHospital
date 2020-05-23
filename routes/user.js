const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const userController = require("../controllers/user");

router.patch("/updateInfo",isAuth(['user']),validate(validationSchemas.updateUser,"body"),userController.updateInfo);
router.get("/notBlocked",isAuth(['user']),userController.notBlocked);
router.patch("/updateImage",isAuth(['user']),userController.updateImage);
module.exports = router;