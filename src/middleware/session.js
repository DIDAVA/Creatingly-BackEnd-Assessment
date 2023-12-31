const crypto = require('crypto')
const fs = require('fs')


const config = {
  datafile: `${global.datadir}/sessions.json`,
  autosave: 60 * 1000,
  cookie: {
    name: 'creatingly.sid',
    secret: 'secret123456',
    options: {
      path: '/',
      maxAge: 30*24*60*60*1000, // 30 days
      secure: false,
      httpOnly: true,
      sameSite: true
    }
  }
}

// Backup functions
function loadBackup() {
  /* === TODO ===
    Must be improved to decode encrypted data and validate before use
  */
  global.sessions = JSON.parse(fs.readFileSync(config.datafile))
}
function saveBackup() {
  /* === TODO ===
    Must encrypt data before saving for more security
  */
  fs.writeFileSync(config.datafile, JSON.stringify(global.sessions))
  console.log(new Date().toISOString(), 'Session backup saved.')
}

// Initial runtime setup
if (!global.sessions) {
  if (fs.existsSync(config.datafile)) loadBackup()
  else {
    global.sessions = {}
    saveBackup()
  }
}

// Auto backup every 60 minutes
setInterval(() => saveBackup(), config.autosave)

// Save backup on exit
process.on('SIGINT', (event, code) => {
  saveBackup()
  process.exit()
})

// Main middleware function
function middleware(req, res, next) {
  let sid = req.cookies[config.cookie.name]
  const isValid = /^[0-9a-f]{64}$/.test(sid)
  const exists = sid in global.sessions
  if (!isValid || !exists) {
    // Create a unique time based session id
    const payload = Date.now() + req.headers['user-agent'] + config.cookie.secret
    sid = crypto.createHash('sha256').update(payload).digest('hex')
    // Set the newly created sid as cookie
    res.cookie(config.cookie.name, sid, config.cookie.options)
    // Set the initial data for user session
    global.sessions[sid] = {
      views: 0,
      watchlist: []
    }
  }
  // Append user session to request object
  req.session = global.sessions[sid]
  next()
}

module.exports = middleware