const { SubCategory, Transaction } = require('../models')

const update = async (req, res) => {
  try {
    const subCategory = await SubCategory.update(
      req.body,
      { where: {id: req.params.subCategoryId }, returning: true }
    )
    res.status(200).json(subCategory)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

const deleteSubCategory = async (req, res) => {
  try {
    const subCategory = await SubCategory.findByPk(
      req.params.subCategoryId
    )
    const affectedTransactions = await Transaction.findAll({
      where: {subCategory: subCategory.name}
    })
    await Promise.all(affectedTransactions.map(t => {
      Transaction.update(
        {...t, subCategory: '-'},
        { where: {id: t.id }, returning: true }
      )
    }))
    await SubCategory.destroy({
      where: { id: req.params.subCategoryId }
    })
    res.status(200).json(affectedTransactions)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  update,
  delete: deleteSubCategory,
}