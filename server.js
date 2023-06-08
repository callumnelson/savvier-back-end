// npm packages
require('dotenv').config()
const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const formData = require('express-form-data')

// import routes
const profilesRouter = require('./routes/profiles.js')
const authRouter = require('./routes/auth.js')
const accountsRouter = require('./routes/accounts.js')
const transactionsRouter = require('./routes/transactions.js')
const categoriesRouter = require('./routes/categories.js')
const subCategoriesRouter = require('./routes/subCategories.js')

// create the express app
const app = express()

// basic middleware
app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(formData.parse())

// mount imported routes
app.use('/api/profiles', profilesRouter)
app.use('/api/auth', authRouter)
app.use('/api/accounts', accountsRouter)
app.use('/api/transactions', transactionsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/sub-categories', subCategoriesRouter)

// handle 404 errors
app.use(function (req, res, next) {
  res.status(404).json({ err: 'Not found' })
})

// handle all other errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500).json({ err: err.message })
})

module.exports = app
