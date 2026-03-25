const mongoose = require("mongoose");

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must be associated with an account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required for ledger entry"],
        immutable:true,
        index:true
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Transaction is required for Ledger entry"],
        index:true,
        immutable:true
    }
    
})


const ledgerModel = mongoose.model("Ledger",ledgerSchema);

module.exports = ledgerModel;