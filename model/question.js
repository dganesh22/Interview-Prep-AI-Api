const mongoose = require("mongoose")

const QuestionSchema = new mongoose.Schema({
    session: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SessionModel"
    },
    question: {
        type: String
    },
    answer: {
        type: String
    },
    note: {
        type: String
    },
    isPinned: {
        type: Boolean,
        default: false
    }
}, {
    collection: "questions",
    timestamps: true
})

module.exports = mongoose.model("QuestionModel", QuestionSchema)