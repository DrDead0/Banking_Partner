const express = require("express");
const router = express.Router();
const authController = require("../config/Controllers/auth.controller.js")

router.post("/register", authController.userRegistercontroller)




module.exports = router