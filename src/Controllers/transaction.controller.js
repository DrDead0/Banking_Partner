const transactionModel = require("../models/transction.model.js")
const accountModel = require("../models/account.model.js")
const ledgerModel = require("../models/ledger.model.js")
const mailService = require("../services/email.service.js")
const mongoose = require("mongoose")


async function createTransactionController(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;

    if(!fromAccount || ! toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"All Fields are required",
            status:"Failed"
        })
    }
    

    //checking if transaction exist or not

   const fromUserAccount = await accountModel.findById({_id:fromAccount})
   const toUserAccount = await accountModel.findById({_id:toAccount})

   if(!fromUserAccount||!toUserAccount){
    return res.status(404).json({
        message:"Account Not Found",
        status:"Failed"
    })
   }

    
}