'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const data = require('../../data/demo_products.json');
    const products = []
    const productDescriptions = []

    data.products.forEach(async product => {        
        const { client_side_uuid, name, description, price, thumbnail_source } = product;

        products.push({ client_side_uuid });
        productDescriptions.push({ 
          name, 
          description, 
          price, 
          thumbnail_source: `${process.env.S3_CDN_URL}/${thumbnail_source}`,
          product_client_side_uuid: client_side_uuid 
        });
    });

    await queryInterface.bulkInsert('Products', products, {});
    await queryInterface.bulkInsert('ProductDescriptions', productDescriptions, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('ProductDescriptions', null, {});
    await queryInterface.bulkDelete('Products', null, {});
  }
};
