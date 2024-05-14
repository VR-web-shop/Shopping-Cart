'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('ProductOrderStates', [
      {
        name: 'SYSTEM_FAILURE',
      },
      {
        name: 'WAITING_FOR_PAYMENT',
      },
      {
        name: 'WAITING_FOR_SHIPMENT',
      },
      {
        name: 'SHIPPED_TO_CUSTOMER',
      },
      {
        name: 'DELIVERED_TO_CUSTOMER',
      },
      {
        name: 'DISCARDED_BY_EMPLOYEE',
      },
      {
        name: 'CANCELLED_BY_CUSTOMER',
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductOrderStates', null, {});
  }
};
