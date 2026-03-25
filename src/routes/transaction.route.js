const express = require("express")
const Router = express.Router()
const transactionController = require("../Controllers/transaction.controller.js")
const authMiddleware = require("../middlewares/auth.middleware.js")



//routes
Router.post("/",authMiddleware,transactionController);



module.exports = Router;