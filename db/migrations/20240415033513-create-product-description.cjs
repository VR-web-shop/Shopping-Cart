'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ProductDescriptions', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name:  { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      description:  { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      thumbnail_source: { 
        type: Sequelize.STRING, 
        allowNull: false 
      },
      price: { 
        type: Sequelize.FLOAT, 
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
      product_client_side_uuid: {
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ProductDescriptions');
  }
};