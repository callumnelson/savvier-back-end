const router = require('express').Router()
const transactionsCtrl = require('../controllers/transactions.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/* ---------------- PUBLIC ROUTES ------------- */



/* ---------------- PRIVATE ROUTES ------------- */
router.use(decodeUserFromToken)
router.get('/', checkAuth, transactionsCtrl.index)
router.put('/:transactionId', checkAuth, transactionsCtrl.update)


module.exports = router