const router = require('express').Router()
const categoriesCtrl = require('../controllers/categories.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/* ---------------- PUBLIC ROUTES ------------- */



/* ---------------- PRIVATE ROUTES ------------- */
router.use(decodeUserFromToken)
router.get('/', checkAuth, categoriesCtrl.index)
router.post('/', checkAuth, categoriesCtrl.create)
router.put('/:categoryId', checkAuth, categoriesCtrl.update)
router.delete('/:categoryId', checkAuth, categoriesCtrl.delete)


module.exports = router