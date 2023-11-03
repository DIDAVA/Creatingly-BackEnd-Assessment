const fs = require('fs')

global.datadir = `${__dirname}/data`
global.db = JSON.parse(fs.readFileSync(`${global.datadir}/rates.json`))

const express = require('express')
const cookieParser = require('cookie-parser')
const session = require('./middleware/session')
const watchlist = require('./routes/watchlist')

const api = express()
api.use(express.json())
api.use(cookieParser())
api.use(session)
api.use('/watchlist', watchlist)

// Get all exchange rates
api.get('/', (req, res) => {
  req.session.views++
  res.json({result: global.db.rates})
})

// Get user's session storage data
api.get('/session', (req, res) => {
  res.json({result: req.session})
})

const port = 5000
api.listen(port, err => {
  if (err) console.error(err)
  console.info('Server is running on port', port)
})