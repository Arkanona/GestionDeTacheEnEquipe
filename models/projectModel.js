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
    author: {           // For US4
        type: String,
        required: true
    },
    collaborator: {     // For US4
        type: Array,
        default: []
    }
})

module.exports = mongoose.model('Project', projectSchema)