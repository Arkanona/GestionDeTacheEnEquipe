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
/*
    Récupérer tous les projets dont l'auteur est req.params.id
    +
    Récupérer TOUS les projets, parcourir chacun des projet pour regarder si dans collaborators il y a l'email de l'utilisateur req.user.email

    Faire une nouvelle constante Array sur lequel pour chaque projet tu fais un push
*/

module.exports = {
    profile,
    checkRole
}