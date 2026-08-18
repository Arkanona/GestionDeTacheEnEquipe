const { test, describe, before, after } = require('node:test')
const assert = require('node:assert')
const mongoose = require('mongoose')
require('dotenv').config()

const User = require('../models/userModel')
const Project = require('../models/projectModels')
const Task = require('../models/taskModel')
const { register, login } = require('../controllers/authController')
const { setProject, addCollaborator, getAllProjects } = require('../controllers/projectController')
const { createTask, assignTask, updateTaskStatus, getProjectTasks } = require('../controllers/taskController')

// Helper mock response
const createMockRes = () => {
    const res = {
        statusCode: 200,
        body: null,
        status(code) {
            this.statusCode = code
            return this
        },
        json(data) {
            this.body = data
            return this
        }
    }
    return res
}

describe('API User Stories (US1 - US9)', () => {
    let userA, userB, tokenA, tokenB, project, task

    before(async () => {
        if (mongoose.connection.readyState === 0) {
            await mongoose.connect(process.env.MONGODB_URI)
        }
        // Cleanup test data
        await User.deleteMany({ email: { $in: ['test_us_a@example.com', 'test_us_b@example.com'] } })
    })

    after(async () => {
        if (project?._id) {
            await Task.deleteMany({ project: project._id })
            await Project.findByIdAndDelete(project._id)
        }
        await User.deleteMany({ email: { $in: ['test_us_a@example.com', 'test_us_b@example.com'] } })
        await mongoose.disconnect()
    })

    test('US1: Register user with email, name, strong password', async () => {
        const reqA = {
            body: {
                name: 'Alice Tester',
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }
        const resA = createMockRes()
        await register(reqA, resA)
        assert.strictEqual(resA.statusCode, 201)
        assert.ok(resA.body.token)
        userA = resA.body.user

        // Register user B
        const reqB = {
            body: {
                name: 'Bob Collaborator',
                email: 'test_us_b@example.com',
                password: 'Password123!'
            }
        }
        const resB = createMockRes()
        await register(reqB, resB)
        assert.strictEqual(resB.statusCode, 201)
        userB = resB.body.user

        // Duplicate email check
        const resDup = createMockRes()
        await register(reqA, resDup)
        assert.strictEqual(resDup.statusCode, 400)
    })

    test('US2: Login user to get secure token', async () => {
        const req = {
            body: {
                email: 'test_us_a@example.com',
                password: 'Password123!'
            }
        }
        const res = createMockRes()
        await login(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.ok(res.body.token)
        tokenA = res.body.token
    })

    test('US3: Create project with title and description', async () => {
        const req = {
            user: { _id: userA.id },
            body: {
                title: 'Project Phoenix',
                description: 'Test project description'
            }
        }
        const res = createMockRes()
        await setProject(req, res)
        assert.strictEqual(res.statusCode, 201)
        assert.strictEqual(res.body.title, 'Project Phoenix')
        project = res.body
    })

    test('US4: Invite collaborator by email', async () => {
        const req = {
            user: { _id: userA.id },
            params: { idProject: project._id.toString() },
            body: { email: 'test_us_b@example.com' }
        }
        const res = createMockRes()
        await addCollaborator(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.ok(res.body.collaborators.includes(userB.id))
    })

    test('US5: Get list of projects as member', async () => {
        const req = {
            user: { _id: userB.id }
        }
        const res = createMockRes()
        await getAllProjects(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.ok(res.body.some(p => p._id.toString() === project._id.toString()))
    })

    test('US6: Create task in project (title, deadline, status)', async () => {
        const req = {
            user: { _id: userB.id },
            params: { idProject: project._id.toString() },
            body: {
                title: 'Setup Database Migration',
                deadline: new Date('2026-12-31'),
                status: 'À faire'
            }
        }
        const res = createMockRes()
        await createTask(req, res)
        assert.strictEqual(res.statusCode, 201)
        assert.strictEqual(res.body.title, 'Setup Database Migration')
        assert.strictEqual(res.body.status, 'À faire')
        task = res.body
    })

    test('US7: Assign task to a project member', async () => {
        const req = {
            user: { _id: userA.id },
            params: { idTask: task._id.toString() },
            body: { assignedTo: userB.id }
        }
        const res = createMockRes()
        await assignTask(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.strictEqual(res.body.assignedTo.toString(), userB.id.toString())
    })

    test('US8: Change task status', async () => {
        const req = {
            user: { _id: userB.id },
            params: { idTask: task._id.toString() },
            body: { status: 'En cours' }
        }
        const res = createMockRes()
        await updateTaskStatus(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.strictEqual(res.body.status, 'En cours')
    })

    test('US9: Filter tasks by status and assigned person', async () => {
        const req = {
            user: { _id: userA.id },
            params: { idProject: project._id.toString() },
            query: { status: 'En cours', assignedTo: userB.id }
        }
        const res = createMockRes()
        await getProjectTasks(req, res)
        assert.strictEqual(res.statusCode, 200)
        assert.strictEqual(res.body.length, 1)
        assert.strictEqual(res.body[0].status, 'En cours')
    })
})