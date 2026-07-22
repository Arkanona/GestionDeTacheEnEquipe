const express = require('express')
const app = express()
const port = 3001

app.get('/', (req, res) => {
    res.send('Gestion de Tâches en Équipe')
})

app.listen(port, () => {
    console.log(`Serveur démarré sur http://localhost:${port}`)
})