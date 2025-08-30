const SessionModel = require('../model/session')
const QuestionModel = require('../model/question')
const { StatusCodes } = require('http-status-codes')


// @desc create a new session and linked questions
// @route POST /api/sessions/create
// @access private
const createSession = async (req,res) => {
    try {
        const { role, experience, topicsToFocus, description, questions } = req.body
        const userId = req.user; // assuming you have have a middleware setting req.user

        const session =  await SessionModel({
            user: userId,
            role,
            experience,
            topicsToFocus,
            description
        })

        const questionDocs= await Promise.all(
            questions.map(async (q) => {
                const question = await QuestionModel.create({
                    session: session._id,
                    question: q.question,
                    answer: q.answer
                });
                return question._id;
            })
        )

        session.questions = questionDocs;
        await session.save()

        res.status(StatusCodes.OK).json({ success: true, message: "session created successfully", session })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ success: false, message: err.message })
    }
}


// @desc get all essions for the logged in user
// @route GET /api/sessions/my-sessions
// @access private
const getMySession = async (req,res) => {
    try {
        const sessions = await SessionModel.find({ user: req.user }).sort({ createdAt: -1 }).populate("questions")

        res.status(StatusCodes.OK).json({ sessions })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}


// @desc get a session by id with populated questions
// @route GET /api/sessions/:id
// @access private
const getSessionById = async (req,res) => {
    try {
        const session = await SessionModel.findById(req.params.id)
                        .populate({
                            path: "questions",
                            options: { sort: { isPinned: -1 , createdAt: 1 }}
                        }).exec();

                if(!session) 
                    return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: `session not found`})

        res.status(StatusCodes.OK).json({ success: true, session })
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}


// @desc deletet a session by id and with its questions
// @route DELETE /api/sessions/:id
// @access private
const deleteSession = async (req,res) => {
    try {
        const session = await SessionModel.findById(req.params.id)

        if(!session)
            return res.status(StatusCodes.NOT_FOUND).json({ success: false, message: "Session not found"})

        // check if the logged in user owns this session
        if(session.user.toString() !== req.user)
            return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, msg: `Not authorized to delete this session `})

        // first , delete all questions linked to this session
        await QuestionModel.deleteMany({ session: session._id })

        // then delete the current session
        await session.deleteOne()

        res.status(StatusCodes.OK).json({ success: true, message: "session deleted successfully"})
    } catch (err) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: err.message })
    }
}




module.exports = { createSession, getSessionById, getMySession, deleteSession }