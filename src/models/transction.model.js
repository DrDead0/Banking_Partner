const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required: [true,"Transaction must be associated with from account"],
        index: true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Transaction must be associated with to account"],
        index: true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can be either Pending,Completed,Failed or Reversed"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for transaction"],
        min:[0,"Transaction amount cannot be negative"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required for transaction"],
        unique:true,
        index:true
    }

    
},{timestamps:true})

const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;