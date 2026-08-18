const Task = require('../models/taskModel')
const Project = require('../models/projectModel')
const User = require('../models/userModel')
const mongoose = require('mongoose')


// Helper to check is ufer is a member of the project (creator or collaborator)
const isProjectMember = (project, userId) => {
    if(!project ||!userId) return false
    const userIdStr = userId.toString()
    const isCreator = project.creator && project.creator.toString() === userIdStr
    const isCollaborator = project.collaborator && project.collaborator.some(id => id.toString() === userIdStr)
    return isCreator || isCollaborator
}
//US6 corrigée
const createTask = async (req, res) => {
    try{
        const idProject = req.params.idProject || req.params.projectId || req.params.project
        const { title, limitDate, taskStatus, helper } = req.body

        if(!title) {
            return res.status(400).json({ message: 'Title is required'})
        }

        if(!idProject) {
            return res.status(400).json({ message: 'Project ID is required'})
        }

        const project = await Project.findById(idProject)
        if(!project){
            return res.status(404).json({ message: 'Project not found'})
        }

        if(!isProjectMember(project, req.user._id)){
            return res.status(403).json({ message: 'Acces denied: You are not member of this project'})
        }

        let assignedUserId = null
        if(helper) {
            let assignee = null
            if(mongoose.Types.ObjectId.isValid(helper)){
                assignee = await User.findById(helper)
            } else {
                assignee = await User.findOne({ email: helper })
            }

            if(!assignee){
                return res.status(404).json({ message: 'Assigned user not found'})
            }

            if(!isProjectMember(project, assignee._id)){
                return res.status(400).json({ message: 'Assigned user must be a member of this project'})
            }
            assignedUserId = assignee._id
        }

        const allowedStatuses = ['To-do', 'In progress', 'Finished']
        if(taskStatus && !allowedStatuses.includes(taskStatus)){
            return res.status(400).json({ message: `Status must be one of : ${allowedStatuses.join(', ')}`})
        }

        const task = await Task.create({
            title,
            limitDate: deadline || limitDate || undefined,
            taskStatus: taskStatus || 'To-do',
            project: project._id,
            helper: assignedUserId,
            createdBy: req.user._id
        })

    } catch(err){
        res.status(500).json({error: err.message})
    }
}

//US7 corrigée
const assignTask = async (req, res) => {
    try {
        const idTask = req.params.idTask || req.params.id
        const assignedTo = req.body.assignedTo || req.body.userId || req.body.email

        if(!idTask){
            return res.status(400).json({ message: 'Task ID is required'})
        }

        if(!assignedTo){
            return res.status(400).json({ message: 'Please provide assignedTo user ID or email'})
        }

        const task = await Task.findById(idTask)
        if(!task){
            return res.status(404).json({ message: 'Task not found'})
        }

        const project = await Project.findById(task.project)
        if(!project){
            return res.status(404).json({ message: 'Task not found'})
        }

        if(!isProjectMember(project, req.user._id)){
            return res.status(403).json({ message: 'Access denied : You are not a member of this project'})
        }

        
        let assignee = null
        if(mongoose.Types.ObjectId.isValid(helper)){
            assignee = await User.findById(helper)
        } else {
            assignee = await User.findOne({ email: helper })
        }

        if(!assignee){
            return res.status(404).json({ message: 'Assigned user not found'})
        }

        if(!isProjectMember(project, assignee._id)){
            return res.status(400).json({ message: 'Assigned user must be a member of this project'})
        }
        task.assignedTo = assignee._id

        const updatedTask = await task.save()
        res.status(200).json(updatedTask)

    } catch(err){
        res.status(500).json({error: err.message})
    }
}

//US8 corrigée
const updateTaskStatus = async (req, res) => {
    try {
        const idTask = req.params.idTask || req.params.id
        const { taskStatus } = req.body

        if(!idTask){
            return res.status(400).json({ message: 'Task ID is required'})
        }

        const allowedStatuses = ['To-do', 'In progress', 'Finished']
        if(!taskStatus && !allowedStatuses.includes(taskStatus)){
            return res.status(400).json({ message: `Status must be one of : ${allowedStatuses.join(', ')}`})
        }

        const task = await Task.findById(idTask)
        if(!task){
            return res.status(404).json({ message: 'Task not found'})
        }

        const project = await Project.findById(task.project)
        if(!project){
            return res.status(404).json({ message: 'Project not found'})
        }

        if(!isProjectMember(project, req.user._id)){
            return res.status(403).json({ message: 'Access denied : You are not a member of this project'})
        }

        task.status = taskStatus
        const updatedTask = task.save()
        res.status(200).json(updatedTask)

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

//US9 corrigée
const getProjectTask = async (req, res) => {
    try{
        const idProject = req.params.idProject || req.params.projectId

        if(!idProject){
            return res.status(400).json({ message: 'Project ID is required'})
        }

        const project = await Project.findById(idProject)
        if(!project){
            return res.status(400).json({ message: 'Project not found'})
        }

        if(!isProjectMember(project, req.user._id)){
            return res.status(403).json({ message: 'Access denied : You are not a member of this project'})
        }

        const filter = { project: idProject }

        if(req.query.status){
            filter.status = req.query.status
        }

        if(req.query.assignedTo){
            filter.assignedTo = req.query.assignedTo
        }

        /*
            Cette ligne rrécupère les tâches en bdd et effectue l'équivalent d'une jointure sql via mongoose pour remplacer les simple identifiant d'utilisateurs (ObjectId) par leurs informations complètes

            Décomposition du code : 
                1. Task.find(filter) : Recherche toutes les tâches correspondant à l'objet filter (ex: projet, taskStatus, etc.)
                2. .populate ('assignedTo', 'name email') : Va chercher dans la collection User le profil correspondant à assignedTo, et n'extrait QUE le name et l'email (évite d'exposer le mot de passe hashé)
                3. .populate ('createdBy', 'name email') : Fait de même pour l'utilisateur qui a crée ma tâche (cratedBy)

        */
        

        const tasks = await Task.find(fliter).populate('assignedTo', 'name email').populate('createdBy', 'name email')
        res.status(200).json(tasks)


    } catch(err){
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    createTask,
    assignTask,
    updateTaskStatus,
    getProjectTask
}