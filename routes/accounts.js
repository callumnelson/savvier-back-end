const router = require('express').Router()
const accountsCtrl = require('../controllers/accounts.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/* ---------------- PUBLIC ROUTES ------------- */



/* ---------------- PRIVATE ROUTES ------------- */
router.use(decodeUserFromToken)
router.post('/', checkAuth, accountsCtrl.createAccount)


module.exports = router