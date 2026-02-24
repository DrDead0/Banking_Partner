const app = require("./src/app.js");
const dotenv = require("dotenv");
dotenv.config();



const Port = process.env.PORT
app.listen(Port,()=>{
    console.log(`The Server is Running on ${Port}`)
})