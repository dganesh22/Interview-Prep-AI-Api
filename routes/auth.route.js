const authRoute = require("express").Router()
const { StatusCodes } = require("http-status-codes")
const { loginUser, registerUser, getUserProfile } = require('../controller/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const upload = require("../middleware/upload.middleware")

// auth routes
authRoute.post(`/register`, registerUser)
authRoute.post(`/login`, loginUser)
authRoute.get(`/profile`, protect, getUserProfile)

// upload image
authRoute.post(`/upload-image`, upload.single("image"), (req,res) => {
    if(!req.file)
        return res.status(StatusCodes.BAD_REQUEST).json({ message: "no file uploaded"})

    const imageUrl = `${req.protocol}://${req.get("host")}/docs/${req.file.filename}`

    res.status(StatusCodes.OK).json({ imageUrl })
})

module.exports = authRoute