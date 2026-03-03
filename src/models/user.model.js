const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");


const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email not found"],
        trim: true,
        lowercase: true,
        unique: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Email is not Valid"]
    },
    name: {
        type: String,
        required: 'Name is required',
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"],
        maxlength: [16, "Password must be at most 16 characters long"],
        select: false // Select is false here
        // it will stop the password to be send in a reponse unitl it is asked
    }
}, { timestamps: true })

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
        return next()
    }

    this.password = await bcrypt.hash(this.password, 10);
    return next();
})

userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

const userModel = mongoose.model("user", userSchema);

module.exports = userModel
