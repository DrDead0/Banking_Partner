const mongoose = require('mongoose');

async function dbConnection(){
     const dbInstance = await mongoose.connect(process.env.MONGO_URI).then(() => {
          console.log("Database Connected")
     }).catch(err => {
          console.log("Error in Connecting to Database", err)
          process.exit(1)
     })

}

module.exports = dbConnection