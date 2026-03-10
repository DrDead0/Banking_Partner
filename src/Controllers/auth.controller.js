const userModel = require("../models/user.model.js");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service.js")

const userRegistercontroller = async (req, res) => {
    try {
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

        const isUserExist = await userModel.findOne({ email })
        if (isUserExist) {
            return res.status(400).json({
                message: "User Already Exist",
                status: "failed"
            })
        }

        const user = await userModel.create({
            email,
            name,
            password
        })

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
        await emailService.sendRegistrationEmail(user.email, user.name)
        res.cookie("token", token);
        res.status(201).json(
            {
                message: "User Registered Successfully",
                status: "success"
            }
        )
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            status: "Failed"
        });
    }
}


const userLoginController = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({
                message: "All fields are required",
                status: "failed"
            })
        }

        const { email, password } = req.body;
        const user = await userModel.findOne({ email }).select("+password");
        if (!user) {
            return res.status(400).json({
                message: "User Does not exist",
                status: "Failed"
            })
        }

        const isValidPassword = await user.comparePassword(password);

        if (!isValidPassword) {
            return res.status(400).json({
                message: "Invalid Password",
                status: "Failed"
            })
        }

        await emailService.loginEmail(user.email, user.name)
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" });
        res.cookie("token", token);

        return res.status(201).json({
            message: "User Logged in Successfully",
            status: "Success"
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            message: "Internal Server Error",
            status: "Failed"
        });
    }
}

module.exports = { userRegistercontroller, userLoginController }