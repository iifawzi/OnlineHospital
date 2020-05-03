const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const router = express.Router();

router.get('/',validate(validationSchemas.addDoctor,"body",false),(req,res,next)=>{
    res.send("hala");
});

module.exports = router;