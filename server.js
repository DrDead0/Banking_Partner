require("dotenv").config();
const app = require("./src/app.js");
const dbConnection = require("./src/config/db.js");
dbConnection();

const Port = process.env.PORT
app.listen(Port, ()=>{
    console.log(`The Server is Running on ${Port}`)
})