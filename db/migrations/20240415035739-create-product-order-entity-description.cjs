'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductOrderEntityDescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        field: 'created_at',
        defaultValue: Sequelize.fn('now')
      },
      updatedAt: {
        type: Sequelize.DATE,
        field: 'updated_at',
        defaultValue: Sequelize.fn('now')
      },
      product_order_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_entity_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      product_order_entity_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
      distributed_transaction_transaction_uuid: {
        type: Sequelize.STRING,
        allowNull: true,
        references: {
          model: 'DistributedTransactions',
          key: 'transaction_uuid'
        }
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductOrderEntityDescriptions');
  }
};