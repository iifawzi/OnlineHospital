const express = require("express");
const authController = require("../controllers/auth");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");

const router = express.Router();


// Any Route related to the authentications stuff will be listed here: 
router.post('/signup',validate(validationSchemas.addUser),authController.signup)
module.exports = router;