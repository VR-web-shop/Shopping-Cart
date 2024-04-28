'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('CartProductEntities', {
      clientSideUUID: {
        type: Sequelize.STRING,
        field: 'client_side_uuid',
        primaryKey: true
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
      cartClientSideUUID: {
        type: Sequelize.STRING,
        field: 'cart_client_side_uuid',
      },
      productEntityClientSideUUID: {
        type: Sequelize.STRING,
        field: 'product_entity_client_side_uuid',
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('CartProductEntities');
  }
};