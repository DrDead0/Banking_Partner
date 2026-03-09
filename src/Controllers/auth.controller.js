const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");

const userRegistercontroller = async (req, res) => {

    //data fetching from body
    if (!req.body) {
        return res.status(400).json({
            message: "Request body is empty or missing",
            status: "failed"
        })
    }

    const { email, name, password } = req.body
    if (!email || !name || !password) {
        return res.status(400).json({
            message: "All Fields are required",
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

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    res.cookie("token", token);
    res.status(201).json(
        {
            message: "User Registered Successfully",
            status: "success"
        }
    )
}



module.exports = { userRegistercontroller }