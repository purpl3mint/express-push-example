const express = require('express')
const config = require('config')
const cors = require('cors')
const path = require('path')

const PORT = process.env.PORT || config.get('port') || 80

const app = express()
app.use(cors())
app.use(express.json())

app.use(express.static(path.resolve(__dirname, 'static')))

app.get('/', (req, res) => {
  res.status(200).json({message: 'Hi!'})
})

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))