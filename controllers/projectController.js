const Project = require('../models/projectModel')
const { formatDate } = require('../helpers/formatDate')
const checkRole = require('./userController')
const Task = require('../models/taskModel')
const User = require('../models/userModel')


// US3
exports.createProject = async (req, res) => {
    try {
        const project = new Project({
            title: req.body.title,
            description: req.body.description,
            author: req.user._id,
            creationDate: req.body.creationDate
        })

        const newProject = await project.save()
        const objProject = newProject.toObject()
        objProject.creationDate = formatDate(newProject.creationDate)
        res.status(201).json(objProject)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

// US4
exports.updateProject = async (req, res) => {
    try {
        const collaborator = req.body
        const project = await Project.findById(req.params.id)
        if(project == null){
            return res.status(404).json({message: 'Project not found'})
        }

        const email = req.body.email

        if(!email){
            return res.status(400).json({ message: 'Invalid Email'})
        }

        if(email == null){
            return res.status(400).json({ message: 'c pas bon'})
        }
        // Seulement le créateur peut inviter
        if(project.author.toString() !== req.user._id.toString()){
            return res.status(400).json({ message: 'Only author can send invite'})
        }
        // Verifier si le collaborator est déja présent
        if(project.collaborator.includes(email)){
            return res.status(400).json({ message: 'Collaborator already exists'})
        }
        const collaboratorInfos = await User.findOne({ email })
        if(!collaboratorInfos){
            return res.status(404).json({ message: 'User not found '})
        }
   
        project.collaborator.push(email) 

        const updateProject = await project.save()
        res.status(200).json(updateProject)
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
}

// US5
exports.getAllProjects = async (req, res) => {
    try {
        // Récupérer tout les projets
        const project = await Project.find({
            $or: [
                { author: req.user._id },
                { collaborator: req.user._id }
            ]
        })

        // Récupérer tout les projets ou je suis collaborateur
        res.status(200).json(project || [])
    } catch (err){
        res.status(500).json({ message: err.message})
    }
}

// US6
exports.createTask = async (req, res) => {
    try {
        const { title, taskStatus } = req.body
        const idProject = req.params.id

        if(!title){
            res.status(400).json({ error: 'You must provide title'})
        }
        if(!idProject){
            return res.status(404).json({ message: "Invalid project"})
        }
        

        const task = new Task({
            title: req.body.title,
            taskStatus: req.body.taskStatus
        })

        const newTask = await task.save()
        const objTask = newTask.toObject()

        res.status(201).json(objTask)

    } catch (err) {
        res.status(500).json({ message: err.message})
    }
}

//US7
// exports.assignTask = async (req, res) => {
//     try{
        
//     } catch(err) {
//         res.status(500).json({ message: err.message})
//     }
// }

// US8
exports.updateStatus = async (req, res) => {
    try{

        const idTask = req.params.id

        if(!idTask){
            return res.status(404).json({ message: "Invalid task"})
        }

        const task = new Task({
            taskStatus: req.body.taskStatus
        })

        const updateTask = await task.save()
        const objTask = updateTask.toObject()

        res.status(201).json(objTask)
    } catch(err) {
        res.status(500).json({ message: err.message})
    }
}