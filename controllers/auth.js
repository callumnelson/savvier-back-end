const { User, Profile, Account, Transaction } = require('../models')
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

    // Create dummy transactions
    const transactions = createFakeTransactions(newProfile)
    const fakeTransactions = await Transaction.bulkCreate(
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

const subCategories = {
  fun: [
    'Events',
    'Vacations/Travel',
    'Eating out',
    'Alcohol',
    'Activities'
  ],
  foodNecessities: [ 'Groceries', 'Pet food', 'CVS' ],
  housing: [
    'Mortgage or Rent',
    'Property taxes',
    'Household repairs',
    'HOA fees',
    'Cleaning'
  ],
  transportation: [
    'Car maintenance',
    'Gas',
    'Public Transit',
    'Registration',
    'Car payments'
  ],
  utilities: [ 'Gas/Electric', 'Water', 'Phones', 'Cable/Internet' ],
  medicalHealth: [
    'Primary care',
    'Dental care',
    'Specialty care',
    'Urgent care',
    'Medications',
    'Prescriptions',
    'Devices/Supplies'
  ],
  savings: [
    'Down Payment',
    'Closing Costs',
    'Furniture',
    'Moving expenses',
    'Honeymoon',
    'Wedding',
    'Investments',
    'Taxes',
    'Cash',
    'Grad School'
  ],
  insurance: [
    'Health insurance',
    'Home insurance',
    'Car insurance',
    'Life insurance',
    'Disability insurance'
  ],
  personal: [
    'Memberships/subscriptions',
    'Clothes',
    'Shoes',
    'Gifts',
    'Donations',
    'Workout stuff',
    'Self care',
    'Online shopping',
    'Other shopping',
    'Home goods'
  ],
  misc: [ 'Small things', 'Work purchases', 'Other', 'Tax Completion' ],
}

const categoriesMap = [ 
  {value: '-', schemaName: 'uncoded'}, 
  {value: 'Fun', schemaName: 'fun'}, 
  {value: 'Food/Necessities', schemaName: 'foodNecessities'},	
  {value: 'Housing', schemaName: 'housing'},
  {value: 'Income', schemaName: 'income'},
  {value: 'Insurance', schemaName: 'insurance'},
  {value: 'Medical/Health', schemaName: 'medicalHealth'},
  {value: 'Misc', schemaName: 'misc'},
  {value: 'Personal', schemaName: 'personal'}, 
  {value: 'Savings', schemaName: 'savings'},
  {value: 'Transportation', schemaName: 'transportation'},
  {value: 'Utilities', schemaName: 'utilities'},
  {value: 'Exclude', schemaName: 'exclude'}
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
    const categories = Object.keys(subCategories)
    for (let i = 0; i < 5; i++){
      for (let cat of categories){
        let subCat = subCategories[cat][Math.floor(Math.random()*subCategories[cat].length)]
        let catFormatted = categoriesMap.find(c => c.schemaName === cat).value
        let trans = {
          profileId: newProfile.id,
          accountId: fakeAccounts.creditCard.id,
          amount: -(Math.random()*100 + 5),
          codingStatus: 'Pending',
          category: catFormatted,
          subCategory: subCat,
          description: `A random purchase in category: ${catFormatted}`,
          transactionDate: new Date(`${month}/01/2022`)
        }
        transactions.push(trans)
      }
    }
  })
  return transactions
}

module.exports = { signup, login, changePassword }
