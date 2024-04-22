'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('DeliverOptions', [
      { client_side_uuid: 'aaa-bbb-ccc' },
      { client_side_uuid: 'ddd-eee-fff' },
      { client_side_uuid: 'ggg-hhh-iii' }
    ], {});

    await queryInterface.bulkInsert('DeliverOptionDescriptions', [
      { name: 'Express Delivery', price: 10.0, deliver_option_client_side_uuid: 'aaa-bbb-ccc' },
      { name: 'Express Delivery', price: 5.0, deliver_option_client_side_uuid: 'aaa-bbb-ccc' },
      { name: 'Home Delivery', price: 15.0, deliver_option_client_side_uuid: 'ddd-eee-fff' },
      { name: 'Home Delivery', price: 7.5, deliver_option_client_side_uuid: 'ddd-eee-fff' },
      { name: 'Pick up', price: 0, deliver_option_client_side_uuid: 'ggg-hhh-iii' },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('DeliverOptionDescriptions', null, {});
    await queryInterface.bulkDelete('DeliverOptions', null, {});
  }
};
