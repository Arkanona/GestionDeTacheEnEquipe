const express = require('express')
const app = express()
const port = 3001

require('dotenv').config()
require('./config/db')

const userRoutes = require('./routes/usersRoutes')
const authRoutes = require('./routes/authRoutes')

app.use(express.json())

app.use('/api/v1/users', userRoutes)
app.use('/api/v1/auth', authRoutes)

app.get('/', (req, res) => {
    res.send('Gestion de Tâches en Équipe')
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})