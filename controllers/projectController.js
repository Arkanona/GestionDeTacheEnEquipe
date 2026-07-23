const Project = require('../models/projectModel')
const { formatDate } = require('../helpers/formatDate')

exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
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