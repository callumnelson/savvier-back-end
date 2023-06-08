const { SubCategory } = require('../models')

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
    const numRemoved = await SubCategory.destroy({
      where: { id: req.params.subCategoryId }
    })
    res.status(200).json(numRemoved)
  } catch (err) {
    console.log(err)
    res.status(500).json({ err })
  }
}

module.exports = {
  update,
  delete: deleteSubCategory,
}