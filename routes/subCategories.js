const router = require('express').Router()
const subCategoriesCtrl = require('../controllers/subCategories.js')
const middleware = require('../middleware/auth.js')

const { decodeUserFromToken, checkAuth } = middleware

/* ---------------- PUBLIC ROUTES ------------- */



/* ---------------- PRIVATE ROUTES ------------- */
router.use(decodeUserFromToken)
router.put('/:subCategoryId', checkAuth, subCategoriesCtrl.update)
router.delete('/:subCategoryId', checkAuth, subCategoriesCtrl.delete)


module.exports = router