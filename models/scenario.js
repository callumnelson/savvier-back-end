'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Scenario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Scenario.belongsTo(models.Profile, { foreignKey: 'profileId' })
    }
  }
  Scenario.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    category: {
      type: DataTypes.STRING,
      allowNull: false,
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
    amount: {
      type: DataTypes.FLOAT,
      validate: {
        min: 0,
      }
    },
  }, {
    sequelize,
    modelName: 'Scenario',
  });
  return Scenario;
};