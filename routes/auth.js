const express = require("express");
const authController = require("../controllers/auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const isAuth = require("../middleware/is-auth");
const router = express.Router();


// Any Route related to the authentications stuff will be listed here: 
router.post('/signup',validate(validationSchemas.addUser,"body"),authController.signup);
router.post('/signin',validate(validationSchemas.signin,"body"), authController.signin);
router.patch('/updateFirebaseToken',validate(validationSchemas.updateFirebaseToken,"body"), authController.updateFbToken);
router.post('/getFirebaseToken',validate(validationSchemas.getFirebaseToken,"body"), authController.getFbToken);
module.exports = router;