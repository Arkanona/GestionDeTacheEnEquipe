const express = require('express')
const app = express()
const port = 3001
const cors = require('cors')
const helmet = require('helmet')
const rateLimit = require('express-rate-limit')


require('dotenv').config()
require('./config/db')

const userRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes')
const projectRoutes = require('./routes/projectsRoutes')
const taskRoutes = require('./routes/taskRoutes')

const { crossOriginResourcePolicy } = require('helmet')

const corsOption = {
    origin: 'http://localhost:3001'
}
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { status: 429, error: 'Too many request'}
})

app.use(
    helmet({
        contentSecurityPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    })
)

app.use(cors(corsOption))
app.use(limiter)
app.use(express.json())

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)
app.use('/api/v1/projects', projectRoutes)
app.use('/api/v1/task', taskRoutes)

app.get('/', (req, res) => {
    res.send('Gestion de Tâches en Équipe')
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})