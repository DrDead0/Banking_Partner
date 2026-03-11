const jwt = require("jsonwebtoken")

const checkLoggedIn = async (req, res, next)=>{
    try{
        const token = req.cookies.token;
        
        if(!token){
            return res.status(401).json({
                message:"You are not Logged In",
                status:"Failed"
            })
        }

        const decodedToken = jwt.verify(token, process.env.JWT_SECRET)
        req.user = decodedToken.userId
        next();
    } catch(err){
        console.error(err)
        return res.status(401).json({
            message:"Unauthorized",
            status:"Failed"
        })
    }
}
module.exports = checkLoggedIn;