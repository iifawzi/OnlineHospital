const express = require("express");
const router = express.Router();
const conferencesController = require("../controllers/conference");


router.get("/",conferencesController.checkConference);


module.exports = router;