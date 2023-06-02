const router = require('express').Router()
const accountsCtrl = require('../controllers/accounts.js')
const middleware = require('../middleware/auth.js')
const account = require('../models/account.js')

const { decodeUserFromToken, checkAuth } = middleware

/* ---------------- PUBLIC ROUTES ------------- */



/* ---------------- PRIVATE ROUTES ------------- */
router.use(decodeUserFromToken)
router.get('/', checkAuth, accountsCtrl.index)
router.post('/', checkAuth, accountsCtrl.create)
router.post('/:accountId/create-transactions', checkAuth, accountsCtrl.createTransactions)


module.exports = router