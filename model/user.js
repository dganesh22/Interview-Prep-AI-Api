const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    mobile: {
        type: String,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    profileImageUrl: {
        type: String,
        default: null
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user"
    },
    isActive: {
        type: Boolean,
        default: false
    }
},{
    collection: "users",
    timestamps: true
})


// methods

// token generation
UserSchema.methods.generateAuthToken = function () {
    return jwt.sign({ id: this._id }, process.env.SECRET_TOKEN, { expiresIn: "24h"})
}

// password comparision
UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password)
}

// hashing password
UserSchema.statics.hashPassword = async function (password) {
    let salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}


module.exports = mongoose.model("UserModel", UserSchema)