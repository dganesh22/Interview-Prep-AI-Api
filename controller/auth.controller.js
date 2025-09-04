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
        const { email, password } = req.body

        // check email exists or not
        const user = await UserModel.findOne({email})
            if(!user)
                return res.status(StatusCodes.NOT_FOUND).json({ message: `${email} id not found`})

            // compare password
            const isMatch = await user.comparePassword(password)
                if(!isMatch)
                    return res.status(StatusCodes.UNAUTHORIZED).json({ message: `passwords are not matched.`})

        // if matched generate token
        const token = await user.generateAuthToken()

        res.status(StatusCodes.OK).json({ message: "user login successfully", token, user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            profileImageUrl: user.profileImageUrl
        } })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : err.message })
    }
}

// get user profile
const getUserProfile = async (req,res) => {
    try {
        let id = req.user
        let user = await UserModel.findById(id).select("-password")
            if(!user)
                return res.status(StatusCodes.NOT_FOUND).json({ message: "requested user id not found"})

        res.status(StatusCodes.OK).json({ user })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : err.message })
    }
}

const logoutUser = async (req,res) => {
     try {

        res.status(StatusCodes.OK).json({ message: "logout successfully" })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : err.message })
    }
}

module.exports = { loginUser, registerUser, getUserProfile, logoutUser }