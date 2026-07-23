const User = require('../models/userModel')

const profile = async (req, res) => {
    try {
        res.status(200).json({ user: req.user })
    } catch(err) {
        return res.status(500).json({ message: 'Server error fetching user profile', error: err.message})
    }
}

const checkRole = async (req, res) => {
    try {
        if(!req.user || req.user.role !== member ){
            return res.status(403).jon({ message: 'Accès refusé : role insuffisant'})
        }
    } catch (err) {
        return res.status(500).json({ message: 'Vous ne participer à aucun projet'})
    }
}

module.exports = {
    profile,
    checkRole
}