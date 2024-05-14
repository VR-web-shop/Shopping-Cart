'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('PaymentOptions', [
      { client_side_uuid: 'aaa-bbb-ccc' },
      { client_side_uuid: 'ddd-eee-fff' },
      { client_side_uuid: 'ggg-hhh-iii' }
    ], {});

    await queryInterface.bulkInsert('PaymentOptionDescriptions', [
      { name: 'Credit Card', price: 10.0, payment_option_client_side_uuid: 'aaa-bbb-ccc' },
      { name: 'Paypal', price: 5.0, payment_option_client_side_uuid: 'aaa-bbb-ccc' },
      { name: 'Bank Transfer', price: 15.0, payment_option_client_side_uuid: 'ddd-eee-fff' },
      { name: 'Cash', price: 0.0, payment_option_client_side_uuid: 'ggg-hhh-iii' }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('PaymentOptionDescriptions', null, {});
    await queryInterface.bulkDelete('PaymentOptions', null, {});
  }
};