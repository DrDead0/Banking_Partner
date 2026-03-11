const accountModel = require("../models/account.model.js")
// const jwt = require("jsonwebtoken")

 

const createAccountController = async (req , res)=>{
    try{
        const user = req.user;
        if(!user){
            return res.status(401).json({
                message:"User Not Found",
                status:"Failed"
            })
        } 

        const account = await accountModel.create({
            user:user._id, 
        })
        res.status(201).json(account)

    }catch(err){
        console.error(err);
        return res.status(401).json({
            message:"Something went wrong",
            status:"Failed"
        })
    }

}

module.exports = {createAccountController}