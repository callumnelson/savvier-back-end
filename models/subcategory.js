'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      SubCategory.belongsTo(models.Category, { foreignKey: 'categoryId' })
    }
  }
  SubCategory.init({
    name: {
      type: DataTypes.STRING,
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      onDelete: 'CASCADE',
      references: {
        model: 'Categories', 
        key: 'id',
      }
    },
    goal: {
      type: DataTypes.FLOAT,
      defaultValue: -1,
    }
  }, {
    sequelize,
    modelName: 'SubCategory',
  });
  return SubCategory;
};