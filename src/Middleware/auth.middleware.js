const userModel = require("../models/user.model.js")
const jwt = require("jsonwebtoken")



async function authMiddleware(req,res,next){
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    try{
        if(!token){
        return res.status(401).json({
            message:"You have not logged in",
            status:"Failed"
        })
    }

    const decodedToken = jwt.verify(token,process.env.JWT_SECRET)
    const user = await userModel.findById(decodedToken.userId)
    if(!user){
        return res.status(401).json({
            message:"User Not Found",
            status:"Failed"
        })
    }

    req.user = user;
    next();
}catch(err){
        console.error(err)
        return res.status(500).json({
            message:" Soemthing went Wrong",
            status:"Failed"
        })
    }
    
}

module.exports = authMiddleware;