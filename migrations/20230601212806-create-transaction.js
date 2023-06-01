'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      accountId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        onDelete: 'CASCADE',
        references: {
          model: 'Accounts',
          key: 'id'
        }
      },
      transactionDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
      },
      amount: {
        type: Sequelize.FLOAT,
      },
      codingStatus: {
        type: Sequelize.ENUM,
        values: ['Pending', 'Saved']
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Transactions');
  }
};