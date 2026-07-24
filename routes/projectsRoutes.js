const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/',authMiddleware, projectController.createProject)
router.patch('/invite/:id', authMiddleware, projectController.updateProject)
router.get('/', authMiddleware, projectController.getAllProjects)

module.exports = router