'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartDescriptions', {
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
      cart_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      cart_state_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      product_order_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartDescriptions');
  }
};