const questionRoute = require('express').Router()
const { protect } = require('../middleware/auth.middleware')
const { togglePinQuestion, updateQuestionNote, addQuestionsToSession } = require('../controller/question.controller')

questionRoute.post(`/add`, protect, addQuestionsToSession)
questionRoute.post(`/:id/pin`, protect, togglePinQuestion)
questionRoute.post(`/:id/note`, protect, updateQuestionNote)

module.exports = questionRoute