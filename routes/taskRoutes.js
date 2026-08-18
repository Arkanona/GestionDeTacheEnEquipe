const express = require('express')
const router = express.Router()
const { createTask, getProjectTask, assignTask, updateTaskStatus } =require('../controllers/taskController')
const authMiddleware = require('../middleware/authMiddleware')

// Task routes
router.post('/project/:idProject', authMiddleware, createTask)
router.get('/project/:idProject', authMiddleware, getProjectTask)
router.patch('/:idTask/assign', authMiddleware, assignTask)
router.patch('/:idTask/status', authMiddleware, updateTaskStatus)

module.exports = router
