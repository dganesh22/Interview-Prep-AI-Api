const sessionRoute = require('express').Router()
const { createSession, getSessionById, getMySession, deleteSession } = require('../controller/session.controller')
const { protect } = require('../middleware/auth.middleware')

sessionRoute.post(`/create`, protect, createSession)
sessionRoute.get(`/my-sessions`, protect, getMySession)
sessionRoute.get(`/:id`, protect, getSessionById)
sessionRoute.delete(`/:id`, protect, deleteSession)

module.exports = sessionRoute