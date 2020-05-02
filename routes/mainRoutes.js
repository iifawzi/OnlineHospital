const express = require("express");
const validate = require("../middleware/validation");
const validationSchemas = require("./validationSchemas");
const router = express.Router();

router.get('/',(req,res,next)=>{
    res.send("hala");
});

module.exports = router;