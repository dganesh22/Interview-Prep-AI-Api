const authRoute = require("express").Router()
const { loginUser, registerUser, getUserProfile } = require('../controller/auth.controller')
const { protect } = require('../middleware/auth.middleware')

// auth routes
authRoute.post(`/register`, registerUser)
authRoute.post(`/login`, loginUser)
authRoute.get(`/profile`, protect, getUserProfile)

module.exports = authRoute