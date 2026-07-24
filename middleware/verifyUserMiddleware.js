const User = require('../models/userModel')
const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

const verifyUserMiddleware = async (req, res, next) => {
    try{
        const decoded = jwt.verify(token, JWT_SECRET)

        const user = await User.findById(decoded.id)

        if(req.user && req.user.role == 'member'){
            res.status(201).json({ message: 'Accés autorisé'})
        }

        req.user = user;
        next();

    } catch (err) {
        res.status(403).json({ message: 'Accès refusé'})
    }
}

module.exports = verifyUserMiddleware