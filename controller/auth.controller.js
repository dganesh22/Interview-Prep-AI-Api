const { StatusCodes } = require('http-status-codes')
const UserModel = require('../model/user')

// register
const registerUser = async (req,res) => {
    try {
        const { name , email, password, profileImageUrl } = req.body

        // check if user already exists
        const userExists = await UserModel.findOne({email})
            if(userExists)
                return res.status(StatusCodes.BAD_REQUEST).json({ message: `${email} already registered`})

        // hash password
        const hashPass = await UserModel.hashPassword(password)

        // create new user
        const newUser = await UserModel.create({
            name,
            email,
            password: hashPass,
            profileImageUrl
        })

        // token
        const token = await newUser.generateAuthToken()

        res.status(StatusCodes.OK).json({ message : "user registered successfully", user: newUser, token })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

// login
const loginUser = async (req,res) => {
    try {
        res.json({ msg: "login user"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

// get user profile
const getUserProfile = async (req,res) => {
    try {
        res.json({ msg: "get profile user"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message })
    }
}

module.exports = { loginUser, registerUser, getUserProfile }