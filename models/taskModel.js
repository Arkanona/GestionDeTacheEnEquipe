const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true
    },
    limitDate: {
        type: Date,
    },
    taskStatus:{
        type: String,
        enum: ['To-do', 'In progress', 'Finished'],
        default: 'To-do'
    }
})

module.exports = mongoose.model('Task', taskSchema)