'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductEntityStates', [
      {
        name: 'AVAILABLE_FOR_PURCHASE',
      },
      {
        name: 'RESERVERED_BY_CUSTOMER_CART',
      },
      {
        name: 'RESERVERED_BY_CUSTOMER_ORDER',
      },
      {
        name: 'SHIPPED_TO_CUSTOMER',
      },
      {
        name: 'DELIVERED_TO_CUSTOMER',
      },
      {
        name: 'RETURNED_BY_CUSTOMER',
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductEntityStates', null, {});
  }
};
