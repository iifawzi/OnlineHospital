const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const userController = require("../controllers/user");
const bodyParser = require("body-parser");

router.use(
    bodyParser.urlencoded({
      parameterLimit: 100000,
      limit: "50mb",
      extended: true
    })
  );
router.patch("/updateInfo",isAuth(['user']),validate(validationSchemas.updateUser,"body"),userController.updateInfo);
router.get("/notBlocked",isAuth(['user']),userController.notBlocked);
router.post("/getUser",isAuth(['user','admin','doctor']),validate(validationSchemas.getUser,"body"),userController.getUser);
router.patch("/updateImage",isAuth(['user']),userController.updateImage);
module.exports = router;