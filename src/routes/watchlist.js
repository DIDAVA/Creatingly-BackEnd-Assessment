const router = require('express').Router()
const { body, validationResult, matchedData } = require('express-validator')

// Get exchange rates based on user's watchlist
router.get(
  '/', 
  (req, res) => {
    req.session.views++
    const rates = req.session.watchlist.reduce((obj, symbol) => {
      if (symbol in global.db.rates) obj[symbol] = global.db.rates[symbol]
      return obj
    }, {})
    res.json({result: rates})
  }
)

// Update user's watchlist
router.put(
  '/', 
  body('currencies').exists().withMessage('Required'),
  body('currencies').isArray().withMessage('Must be an array'),
  body('currencies[*]').matches(/^[A-Z]{3}$/).withMessage('Invalid currency symbol'),
  body('currencies[*]').custom(symbol => {
    if (symbol in global.db.rates) return true
    throw new Error('Unsupported currency symbol')
  }),
  (req, res) => {
    const result = validationResult(req)
    if (result.isEmpty()) {
      const data = matchedData(req)
      req.session.watchlist = data.currencies
      res.json({result: 'OK'})
    }
    else res.json({error: result.array()})
  }
)

module.exports = router