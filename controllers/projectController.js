const Project = require('../models/projectModel')
const { formatDate } = require('../helpers/formatDate')


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

exports.updateProject = async (req, res) => {
    try {
        const project = await Project.findById(req.params.id)
        if(project == null){
            return res.status(404).json({message: 'Produit non trouvée'})
        }

        if (req.body.collaborator != null){
            project.collaborator = req.body.collaborator
        }

        const updateProject = await project.save()
        res.json(updateProject)
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
}