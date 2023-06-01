'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Transaction.belongsTo(models.Account, { foreignKey: 'accountId' })
    }
  }
  Transaction.init({
    accountId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Accounts',
        key: 'id'
      }
    },
    transactionDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
    },
    amount: {
      type: DataTypes.FLOAT,
    },
    category: {
      type: DataTypes.STRING,
    },
    subCategory: {
      type: DataTypes.STRING,
    },
    codingStatus: {
      type: DataTypes.ENUM,
      values: ['Pending', 'Saved']
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });
  return Transaction;
};