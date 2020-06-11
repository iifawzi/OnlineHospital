const express = require("express");
const router = express.Router();
const conferencesController = require("../controllers/conference");


router.post("/",conferencesController.checkConference);


module.exports = router;