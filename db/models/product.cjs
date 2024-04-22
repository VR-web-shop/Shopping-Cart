'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      //Product.hasMany(models.ProductEntity);
      models.Product.hasMany(models.ProductDescription, {
        foreignKey: 'product_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Product.hasMany(models.ProductRemoved, {
        foreignKey: 'product_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Product.hasMany(models.ProductEntityDescription, {
        foreignKey: 'product_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  Product.init({
    client_side_uuid: {
      type: DataTypes.STRING,
      field: 'client_side_uuid',
      primaryKey: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    }
  }, {
    sequelize,
    modelName: 'Product'
  });
  return Product;
};