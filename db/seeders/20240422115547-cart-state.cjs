'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('CartStates', [
      {
        name: 'OPEN_FOR_PRODUCT_ENTITIES',
      },
      {
        name: 'WAITING_FOR_CHECKOUT',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('CartStates', null, {});
  }
};
