const mongoose = require("mongoose")


const transactionSchema = new mongoose.Schema({

})

const transactionModel = mongoose.model("transaction",transactionSchema);

module.exports = transactionModel;