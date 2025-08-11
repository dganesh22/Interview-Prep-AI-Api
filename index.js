require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const { StatusCodes } = require("http-status-codes")
const connectDB = require('./config/db')
const PORT = process.env.PORT

const app = express()


// middleware 
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

// cors
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}))

// static folder
app.use("/docs", express.static(path.join(__dirname, "docs"), {}))

// index path
app.get(`/`, async (req,res) => {
    try {
        res.json({ message: "welcome to interivew prep api"})
    } catch (err) {
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message : err.message })
    }
})

// lisener
app.listen(PORT,() => {
    connectDB()
    console.log(`server is running @http://localhost:${PORT}`)
}) 