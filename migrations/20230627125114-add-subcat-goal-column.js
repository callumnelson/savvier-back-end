'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('SubCategories', 'goal', {
      type: Sequelize.FLOAT,
      default: -1,
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('SubCategories', 'goal')
  }
};
