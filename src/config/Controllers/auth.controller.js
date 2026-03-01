const userModel = require("../models/user.model.js")


userRegistercontroller = async(req , res)=>{
    const {email,name,password} = req.body
    const isUserExist = await userModel.findOne({email})
    if(isUserExist){
        return res.status*(400).json({
            message:"User Already Exist",
            status:"failed"
        })
    }
}



module.exports = {userRegistercontroller}