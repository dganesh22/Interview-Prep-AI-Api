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

// api paths
app.use(`/api/auth`, require('./routes/auth.route'))
app.use(`/api/sessions`, require('./routes/session.route'))
app.use(`/api/questions`, require('./routes/question.route'))
app.use(`/api/ai`, require("./routes/ai.route"))

// lisener
app.listen(PORT,() => {
    connectDB()
    console.log(`server is running @http://localhost:${PORT}`)
}) 