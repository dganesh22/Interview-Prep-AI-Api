const aiRoute = require('express').Router()
const { generateInteviewQuestions, generateConceptExplanation} = require("../controller/ai.controller")
const { protect } = require('../middleware/auth.middleware')

aiRoute.post(`/generate-questions`, protect, generateInteviewQuestions)
aiRoute.post(`/generate-explanation`, protect, generateConceptExplanation)

module.exports = aiRoute