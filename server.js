const express = require('express')
const path = require('path')
const app = express()

app.use(express.static(path.join(__dirname)))
app.use('/modules', express.static(path.join(__dirname, 'modules')))

app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

app.get('/', (_, res) => {
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.listen(9000, () => {
    console.log('Server start');
    
})