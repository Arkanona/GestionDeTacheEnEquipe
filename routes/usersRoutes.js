const express = require('express')
const router = express.Router()
const { profile, checkRole } = require('../controllers/userController')
const authMiddleware = require('../middleware/authMiddleware')
const verifyUserMiddleware = require('../middleware/verifyUserMiddleware')

router.get('/profile',authMiddleware, profile)
router.get('/:id', authMiddleware, checkRole)

module.exports = router