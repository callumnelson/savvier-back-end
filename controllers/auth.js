const { User, Profile, Account, Transaction, Category, SubCategory } = require('../models')
const jwt = require('jsonwebtoken')

async function signup(req, res) {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('no CLOUDINARY_URL in back-end .env file')
    }

    const user = await User.findOne({ where: { email: req.body.email } })
    if (user) throw new Error('Account already exists')

    const newUser = await User.create(req.body)
    req.body.userId = newUser.id
    const newProfile = await Profile.create(req.body)
    newUser.dataValues.profile = { id: newProfile.dataValues.id }

    // Create dummy accounts
    fakeAccounts.checking.profileId = newProfile.id
    fakeAccounts.creditCard.profileId = newProfile.id
    const checking = await Account.create(fakeAccounts.checking)
    const creditCard = await Account.create(fakeAccounts.checking)
    fakeAccounts.checking.id = checking.dataValues.id
    fakeAccounts.creditCard.id = creditCard.dataValues.id

    // Create default schema
    await Promise.all([
      categoriesMap.map( async (cat) => {
        const newCategory = await Category.create({
          profileId: newProfile.id,
          name: cat.category
        })
        await Promise.all([
          cat.subCategories.map( async (sub) => {
            SubCategory.create({
              categoryId: newCategory.id,
              name: sub
            })
          })
        ])
      })
    ])

    // Create dummy transactions
    const transactions = createFakeTransactions(newProfile)

    await Transaction.bulkCreate(
      transactions,
      { validate: true }
    )

    const token = createJWT(newUser)
    res.status(200).json({ token })
  } catch (err) {
    console.log(err)
    try {
      if (req.body.userId) {
        await User.destroy({ where: { id: req.body.userId } })
      }
    } catch (err) {
      return res.status(500).json({ err: err.message })
    }
    res.status(500).json({ err: err.message })
  }
}

async function login(req, res) {
  try {
    if (!process.env.SECRET) throw new Error('no SECRET in back-end .env')
    if (!process.env.CLOUDINARY_URL) {
      throw new Error('no CLOUDINARY_URL in back-end .env file')
    }

    const user = await User.findOne({
      where: { email: req.body.email },
      include: { model: Profile, as: 'profile', attributes: ['id'] },
    })
    if (!user) throw new Error('User not found')

    const isMatch = await user.comparePassword(req.body.password)
    if (!isMatch) throw new Error('Incorrect password')

    const token = createJWT(user)
    res.json({ token })
  } catch (err) {
    handleAuthError(err, res)
  }
}

async function changePassword(req, res) {
  try {
    const user = await User.findByPk(req.user.id)
    if (!user) throw new Error('User not found')

    const isMatch = user.comparePassword(req.body.curPassword)
    if (!isMatch) throw new Error('Incorrect password')

    user.password = req.body.newPassword
    await user.save()

    const token = createJWT(user)
    res.json({ token })
  } catch (err) {
    handleAuthError(err, res)
  }
}

// /* --== Helper Functions ==-- */

function handleAuthError(err, res) {
  console.log(err)
  const { message } = err
  if (message === 'User not found' || message === 'Incorrect password') {
    res.status(401).json({ err: message })
  } else {
    res.status(500).json({ err: message })
  }
}

function createJWT(user) {
  return jwt.sign({ user }, process.env.SECRET, { expiresIn: '24h' })
}


const fakeAccounts = {
  checking: {
    name: 'Demo Acct 1',
    type: 'Checking'
  },
  creditCard: {
    name: 'Demo Acct 2',
    type: 'Credit Card'
  }
}

const months = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]

const categoriesMap = [
  {
    category: '-',
    subCategories: ['-']
  },
  {
    category: 'Income',
    subCategories: [
      '-',
      'Paycheck',
      'Investment',
      'Gift'
    ]
  },
  {
    category: 'Fun',
    subCategories: [
      '-',
      'Events',
      'Vacations/Travel',
      'Eating Out',
      'Alcohol',
      'Activities'
    ],
  },
  {
    category: 'Housing',
    subCategories: [
      '-',
      'Mortgage or Rent',
      'Property Taxes',
      'Household Repairs',
      'HOA Fees',
      'Cleaning'
    ]
  },
  {
    category: 'Transportation',
    subCategories: [
      '-',
      'Car Maintenance',
      'Gas',
      'Public Transit',
      'Registration',
      'Car Payments'
    ],
  },
  {
    category: 'Utilities',
    subCategories: [ 
      '-',
      'Gas/Electric', 
      'Water', 
      'Phones', 
      'Cable/Internet' 
    ],
  },
  {
    category: 'Medical/Health',
    subCategories: [
      '-',
      'Primary Care',
      'Dental Care',
      'Specialty Care',
      'Urgent Care',
      'Medications',
      'Prescriptions',
      'Devices/Supplies'
    ],
  },
  {
    category: 'Savings',
    subCategories: [
      '-',
      'Down Payment',
      'One Time Emergency',
      'Furniture',
      'Moving Expenses',
      'Grad School'
    ],
  },
  {
    category: 'Insurance',
    subCategories: [
      '-',
      'Health Insurance',
      'Home Insurance',
      'Car Insurance',
      'Life Insurance',
      'Disability Insurance'
    ],
  },
  {
    category: 'Personal',
    subCategories: [
      '-',
      'Memberships/subscriptions',
      'Clothes',
      'Shoes',
      'Gifts',
      'Donations',
      'Self Care',
      'Online Shopping',
      'Other Shopping',
      'Home Goods'
    ],
  },
  {
    category: 'Misc',
    subCategories: [ 
      '-',
      'Small Things', 
      'Other',
    ],
  },
  {
    category: 'Exclude',
    subCategories: [
      '-',
      'Payment',
      'Transfer'
    ]
  },

]

function createFakeTransactions(newProfile) {
  const transactions = []
  months.forEach(month => {
    // Add income 
    for (let i = 0; i < 2; i++){
      let trans = {
        profileId: newProfile.id,
        accountId: fakeAccounts.checking.id,
        amount: (Math.random()*1000 + 1000),
        codingStatus: 'Pending',
        category: 'Income',
        subCategory: 'Paycheck',
        description: 'Direct Deposit from Your Employer',
        transactionDate: new Date(`${month}/01/2022`)
      }
      transactions.push(trans)
    }
    for (let i = 0; i < 5; i++){
      for (let cat of categoriesMap){
        // Create transactions for non-income categories
        if (cat.category !== 'Income' && cat.category !== '-'){
          let subCat = cat.subCategories[
            Math.floor(Math.random()*cat.subCategories.length)
          ]
          let trans = {
            profileId: newProfile.id,
            accountId: fakeAccounts.creditCard.id,
            amount: -(Math.random()*100 + 5),
            codingStatus: 'Pending',
            category: cat.category,
            subCategory: subCat,
            description: `A random transaction in category: ${cat.category}`,
            transactionDate: new Date(`${month}/01/2022`)
          }
          transactions.push(trans)
        }
      }
    }
  })
  return transactions
}

module.exports = { signup, login, changePassword }
