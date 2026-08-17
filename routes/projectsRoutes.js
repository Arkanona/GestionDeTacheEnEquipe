const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/',authMiddleware, projectController.createProject)
router.patch('/invite/:id', authMiddleware, projectController.updateProject)
router.get('/', authMiddleware, projectController.getAllProjects)
router.patch('/task/:id', authMiddleware, projectController.createTask)
router.patch('/task/update/:id', authMiddleware, projectController.updateStatus)

module.exports = router