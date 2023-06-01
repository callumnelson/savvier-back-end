const { Account, Profile } = require('../models')

const createAccount = async (req, res) => {
  try {
    req.body.profileId = req.user.profile.id
    const account = await Account.create(req.body)
    res.status(200).json(account)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  createAccount
}