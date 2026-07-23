const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    creationDate: {
        type: Date,
        default: Date.now
    },
    author: {
        type: String,
        required: true
    },
    collaborator: {
        type: Array
    }
})

module.exports = mongoose.model('Project', projectSchema)