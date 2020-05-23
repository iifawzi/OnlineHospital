const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const categoiresController = require("../controllers/categories");


router.post("/getCategories",isAuth(['admin','user']),categoiresController.getCategories);


module.exports = router;