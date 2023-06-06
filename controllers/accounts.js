const { Account, Transaction } = require('../models')
const currency = require('currency.js')

const create = async (req, res) => {
  try {
    req.body.profileId = req.user.profile.id
    const account = await Account.create(req.body)
    res.status(200).json(account)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const update = async (req, res) => {
  try {
    const account = await Account.update(
      req.body,
      { where: {id: req.params.accountId }, returning: true }
    )
    res.status(200).json(account)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const index = async (req, res) => {
  try {
    const accounts = await Account.findAll({
      where: { profileId: req.user.profile.id }
    })
    res.status(200).json(accounts)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const deleteAccount = async (req, res) => {
  try {
    const numRemoved = await Account.destroy({
      where: { id: req.params.accountId }
    })
    res.status(200).json(numRemoved)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const createTransactions = async (req, res) => {
  try {
    req.body.transactions.forEach( t => {
      t.profileId = req.user.profile.id
      t.accountId = parseInt(req.params.accountId)
      t.amount = currency(t.amount)
      t.codingStatus = 'Pending'
      t.category = t.category ?? '-'
      t.subCategory = t.subCategory ?? '-'
      t.description = t.description.replace(/\s+/g, ' ')
      t.transactionDate = new Date(t.transactionDate)
    })

    const transactions = await Transaction.bulkCreate(
      req.body.transactions,
      { validate: true }
    )

    res.status(200).json(transactions)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  create,
  update,
  index,
  createTransactions,
  delete: deleteAccount
}