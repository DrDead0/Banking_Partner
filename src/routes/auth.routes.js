const express = require("express");
const router = express.Router();
const authController = require("../Controllers/auth.controller.js")



//routers with controllers function attached
router.post("/register", authController.userRegistercontroller);
router.post('/login',authController.userLoginController)



module.exports = router