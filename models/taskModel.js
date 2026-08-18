const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema(
    {
        title:{
            type: String,
            required: true,
            trim: true
        },
        limitDate: {
            type: Date,
        },
        taskStatus:{
            type: String,
            enum: ['To-do', 'In progress', 'Finished'],
            default: 'To-do'
        },
        project:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
            required: [true, 'Peojzct is required']
        },
        helper:{            // US7
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            default: null
        },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model('Task', taskSchema)