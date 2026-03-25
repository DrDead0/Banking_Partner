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
    },
    type:{
        type:String,
        required:[true,"Ledger Type is required"],
        index:true,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type must be CREDIT or DEBIT"
        }
    }
    
})

//prevent ledger modification
function preventLedgerModification(){
   throw new Error("Ledger entries cannot be modified");
}


//prevent ledger modification run when other methods are called 
ledgerSchema.pre('findOneAndUpdate',preventLedgerModification)
ledgerSchema.pre('updateOne',preventLedgerModification)
ledgerSchema.pre('deleteOne',preventLedgerModification)
ledgerSchema.pre('remove',preventLedgerModification)
ledgerSchema.pre('deleteMany',preventLedgerModification)

const ledgerModel = mongoose.model("Ledger",ledgerSchema);

module.exports = ledgerModel;