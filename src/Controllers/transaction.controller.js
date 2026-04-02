const transactionModel = require("../models/transction.model.js")
const accountModel = require("../models/account.model.js")
const ledgerModel = require("../models/ledger.model.js")
const mailService = require("../services/email.service.js")
const mongoose = require("mongoose")


async function createTransactionController(req,res){
    const {fromAccount,toAccount,amount,idempotencyKey} = req.body;

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"All Fields are required",
            status:"Failed"
        })
    }
    
    if (amount <= 0) {
        return res.status(400).json({
            message:"Amount must be greater than zero",
            status:"Failed"
        })
    }

    if (fromAccount === toAccount) {
        return res.status(400).json({
            message:"Cannot transfer to the same account",
            status:"Failed"
        })
    }

    //checking if transaction exist or not

   const fromUserAccount = await accountModel.findById(fromAccount)
   const toUserAccount = await accountModel.findById(toAccount)

   if(!fromUserAccount||!toUserAccount){
    return res.status(400 ).json({
        message:"Account Not Found",
        status:"Failed"
    })
   }
   //transaction validation
   
   const isTransactionExist = await transactionModel.findOne({idempotencyKey:idempotencyKey})

   //now check if the idempotency key already exist or not
   //if does exist that means we are doing the same transaction again which is bad

  if(isTransactionExist){
    if(isTransactionExist.status==='COMPLETED'){
        return res.status(200).json({
            message:"Transaction Completed",
            status:"Success"
        })
    }
    if(isTransactionExist.status==='PENDING'){
        return res.status(200).json({
            message:"Transaction is Pending",
            status:"Success"
        })
    }
    if(isTransactionExist.status==='FAILED'){
        return res.status(500).json({
            message:"Transaction is Failed",
            status:"Failed"
        })
    }
    if(isTransactionExist.status==='REVERSED'){
        return res.status(500).json({
            message:"Transaction is Reversed",
            status:"Failed"
        })
    }
  }
  //check if the account is active or not
  if(fromUserAccount.status!=='ACTIVE'|| toUserAccount.status!=='ACTIVE'){
    return res.status(400).json({
        message:"Account Must Be Active",
        status:"Failed"
    })
  }
 //checking senders balance from ledger
 
 const senderBalance  = await fromUserAccount.getBalance()
 if(senderBalance<amount){
    return res.status(400).json({
        message:"Insufficient Balance",
        status:"Failed"
    })
 }

 const session = await mongoose.startSession();
 session.startTransaction();
 try{
    // Using an array when passing session options to .create() for correct behavior
    const [transaction] = await transactionModel.create([{
        fromAccount,
        toAccount,
        idempotencyKey,
        amount,
        status:"PENDING"
    }], { session });

    //debiting the sender account
    const creaditLedger = await ledgerModel.create([{
        accountId:toAccount,
        type:"CREDIT",
        amount:amount,
        transaction:transaction._id
    }], { session });
 
    const debitLedger = await ledgerModel.create([{
        accountId:fromAccount,
        type:"DEBIT",
        amount:amount,
        transaction:transaction._id
    }], { session });
 
    transaction.status = "COMPLETED";
    await transaction.save({ session });

    await session.commitTransaction();
    session.endSession();

    // Sending success response directly (previously missing)
    return res.status(200).json({
        message: "Transaction Completed Successfully",
        status: "Success"
    });

 }catch(err){
    await session.abortTransaction();
    session.endSession();
    console.error(err);
    return res.status(500).json({
        message:"Transaction failed",
        status:"Failed"
   })
 }
}