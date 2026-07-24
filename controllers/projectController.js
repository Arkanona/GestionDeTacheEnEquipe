const Project = require('../models/projectModel')
const { formatDate } = require('../helpers/formatDate')
const checkRole = require('./userController')



exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            author: req.user.id,
            creationDate: req.body.creationDate
        })

        const newProject = await project.save()
        const objProject = newProject.toObject()
        objProject.creationDate = formatDate(newProject.creationDate)
        res.status(201).json(objProject)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
}

// US4
exports.updateProject = async (req, res) => {
    try {
        const { collaborator } = req.body
        const project = await Project.findById(req.params.id)
        if(project == null){
            return res.status(404).json({message: 'Project not found'})
        }

        const email = req.body.email

        if(email == null){
            return res.status(400).json({ message: 'c pas bon'})
        }
        // Verifier si le collaborator est déja présent
        if(project.collaborator.includes(email)){
            return res.status(400).json({ message: 'Collaborator already exists'})
        }
   
        project.collaborator.push(email) 

        const updateProject = await project.save()
        res.json(updateProject)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
}