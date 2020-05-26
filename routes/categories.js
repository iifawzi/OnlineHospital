const express = require("express");
const router = express.Router();
const isAuth = require("../middleware/is-auth");
const categoiresController = require("../controllers/categories");


router.get("/getCategories",isAuth(['admin','user']),categoiresController.getCategories);


module.exports = router;