const { Profile, Account, Transaction, Category, SubCategory } = require('../models')
const cloudinary = require('cloudinary').v2

async function index(req, res) {
  try {
    const profiles = await Profile.findAll()
    res.json(profiles)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function getUserProfile(req, res) {
  try {
    const results = await Promise.all([
        Profile.findByPk(
          req.user.profile.id,
          { include: [
            { model: Account, as: 'accounts' }, 
            { model: Transaction, as: 'profileTransactions' },
          ]},
        ),
        Category.findAll({
          where: { profileId: req.user.profile.id },
          include: [
            { model: SubCategory, as: 'subCategories'}
          ]
        })
      ]
    )
    const [profile, categories] = results
    profile.dataValues.categories = categories
    res.status(200).json(profile)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

async function addPhoto(req, res) {
  try {
    const imageFile = req.files.photo.path
    const profile = await Profile.findByPk(req.params.id)

    const image = await cloudinary.uploader.upload(
      imageFile, 
      { tags: `${req.user.email}` }
    )
    profile.photo = image.url

    await profile.save()
    res.status(201).json(profile.photo)
  } catch (err) {
    console.log(err)
    res.status(500).json(err)
  }
}

module.exports = { index, addPhoto, getUserProfile }
