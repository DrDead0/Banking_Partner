const userModel = require("../../models/user.model.js")


const userRegistercontroller = async (req, res) => {

    //data fetching from body
    const { email, name, password } = req.body
    if (!email || !name || !password){
        return res.status(400).json({
            message:"All Fields are required",
            status: "failed"
        })
    }
    

    // User Existance Checking
    const isUserExist = await userModel.findOne({ email })
    if (isUserExist) {
        return res.status(400).json({
            message: "User Already Exist",
            status: "failed"
        })
    }

    // User Creation
    const user = await userModel.create({
        email,
        name,
        password
    })

}



module.exports = { userRegistercontroller }