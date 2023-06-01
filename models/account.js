'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Account.belongsTo(models.Profile, { foreignKey: 'profileId' })
    }
  }
  Account.init({
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    type: {
      type: DataTypes.ENUM,
      values: ['Credit Card', 'Checking', 'Savings', 'Other']
    },
    profileId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Profiles', 
        key: 'id',
      }
    },
  }, {
    sequelize,
    modelName: 'Account',
  });
  return Account;
};