'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Category.belongsTo(models.Profile, { foreignKey: 'profileId' })
      Category.hasMany(models.SubCategory, { 
        foreignKey: 'categoryId',
        as: 'subCategories'
      })
    }
  }
  Category.init({
    name: {
      type: DataTypes.STRING,
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
    modelName: 'Category',
  });
  return Category;
};