const mongoose = require('mongoose')

const SessionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserModel"
    },
    role: {
        type: String,
        required: true
    },
    experience: {
        type: Number,
        required: true
    },
    topicsToFocus: {
        type: String,
        required: true
    },
    description: {
         type: String,
        required: true
    },
    questions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "QuestionModel"
    }]
}, {
    collection: "sessions",
    timestamps: true
})

module.exports = mongoose.model("SessionModel", SessionSchema)