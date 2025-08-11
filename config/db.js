const mongoose = require('mongoose')

const connectDB = async () => {
    if(process.env.MODE === "development") {
        await mongoose.connect(process.env.LOCAL_DB)
            .then(res => console.log(`local mongodb connected`))
            .catch(err => console.error(err.message))
    }
    if(process.env.MODE === "production") {
        await mongoose.connect(process.env.CLOUD_DB)
            .then(res => console.log(`cloud mongodb connected`))
            .catch(err => console.error(err.message))
    }
}

module.exports = connectDB