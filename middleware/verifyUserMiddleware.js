const User = require('../models/userModel')

const verifyUserMiddleware = async (req, res, next) => {
    try{
        if(req.user && req.user.role == 'member'){
            res.status(201).json({ message: 'Accés autorisé'})
        }
        next();
    } catch (err) {
        res.status(403).json({ message: 'Accès refusé'})
    }
}

module.exports = verifyUserMiddleware