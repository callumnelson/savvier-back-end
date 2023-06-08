const { Category, SubCategory } = require('../models')

const create = async (req, res) => {
  try {
    req.body.profileId = req.user.profile.id
    const category = await Category.create(req.body)
    res.status(200).json(category)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const update = async (req, res) => {
  try {
    const category = await Category.update(
      req.body,
      { where: {id: req.params.categoryId }, returning: true }
    )
    res.status(200).json(category)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const deleteCategory = async (req, res) => {
  try {
    const numRemoved = await Category.destroy({
      where: { id: req.params.categoryId }
    })
    res.status(200).json(numRemoved)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  create,
  update,
  delete: deleteCategory,
}