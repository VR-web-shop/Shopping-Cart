'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DistributedTransactions', {      
      transactionUUID: {
        type: Sequelize.STRING,
        field: 'transaction_uuid',
        primaryKey: true
      },
      distributed_transaction_state_name: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'DistributedTransactionStates',
          key: 'name'
        },
      },
      transaction_message: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('now')
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('DistributedTransactions');
  }
};
