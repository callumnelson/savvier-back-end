const { Transaction } = require('../models')

const update = async (req, res) => {
  try {
    const transaction = await Transaction.update(
      req.body,
      { where: {id: req.params.transactionId }, returning: true }
    )
    res.status(200).json(transaction)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const index = async (req, res) => {
  try {
    const transactions = await Transaction.findAll({
      where: { profileId: req.user.profile.id }
    })
    res.status(200).json(transactions)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const numRemoved = await Transaction.destroy({
      where: { id: req.params.transactionId }
    })
    res.status(200).json(numRemoved)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  update,
  index,
  delete: deleteTransaction
}