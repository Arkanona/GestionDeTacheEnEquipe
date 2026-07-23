const express = require('express')
const router = express.Router()
const projectController = require('../controllers/projectController')
const authMiddleware = require('../middleware/authMiddleware')


router.post('/',authMiddleware, projectController.createProject)
router.patch('/:id', authMiddleware, projectController.updateProject)

module.exports = router