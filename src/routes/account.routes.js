const express = require("express");
const Router = express.Router();
const accountController = require("../Controllers/account.controller.js")
const authMiddleware = require("../Middleware/auth.middleware.js")




Router.post("/",authMiddleware, accountController.createAccountController)



module.exports = Router;