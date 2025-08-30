const QuestionModel = require('../model/question')
const SessionModel = require('../model/session')
const {StatusCodes} = require('http-status-codes')

// @desc    Add additional questions to an existing session
// @route   POST /api/questions/add
// @access  Private
const addQuestionsToSession = async (req,res) => {
    try {
        const { sessionId, questions } = req.body

        if(!sessionId || !questions || !Array.isArray(questions)) 
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Invalid input data"})

        const session = await SessionModel.findById(sessionId)
            if(!session)
                return res.status(StatusCodes.NOT_FOUND).json({ message: "session not found"})

        // create new questions
        const createdQuestions = await QuestionModel.insertMany(
            questions.map((q) => ({
                session: sessionId,
                question: q.question,
                answer: q.answer
            }))
        )

        // udate session to include new questions id's
        session?.questions.push(...createdQuestions.map((q) => q._id ))
        await session.save()

        res.status(StatusCodes.CREATED).json({ message: "questions added successfully", questions: createdQuestions})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

// @desc    Pin or unpin the question
// @route   POST /api/questions/:id/pin
// @access  Private
const togglePinQuestion = async (req,res) => {
    try {
        const question = await QuestionModel.findById(req.params.id)

        if(!question)
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `requested question not found`})
        question.isPinned = !question.isPinned;
        await question.save()
        res.status(StatusCodes.OK).json({ success: true, question, message: "question is pinned successfully"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

// @desc    update a note for a question
// @route   POST /api/questions/:id/note
// @access  Private
const updateQuestionNote = async (req,res) => {
    try {
        const { note } = req.body
        const question = await QuestionModel.findById(req.params.id)

        if(!question)
             return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `requested question not found`})

        question.note = note || ""
        await question.save()
        res.status(StatusCodes.OK).json({ success: true, question, message: "note updated successfully"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message})
    }
}

module.exports = { addQuestionsToSession, togglePinQuestion, updateQuestionNote}

