const jwt = require('jsonwebtoken')
const UserModel = require("../model/user")
const { StatusCodes } = require('http-status-codes')

// protect middleware
const protect = async (req,res, next) => {
    try {
        let token = req.headers.authorization;

        if(token && token.startsWith('Bearer')) {
            token = token.split(" ")[1] // extract token
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN)
            req.user = decoded.id
            next()
        } else {
            res.status(StatusCodes.UNAUTHORIZED).json({ message: "Access denied Unauthorized or no token"})
        }
    } catch (err) {
        res.status(StatusCodes.UNAUTHORIZED).json({ message: "token failed", error: err.message })
    }
} 

module.exports = { protect }