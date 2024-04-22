'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrderEntity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOrderEntity.hasMany(models.ProductOrderEntityDescription, {
        foreignKey: 'product_order_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductOrderEntity.hasMany(models.ProductOrderEntityRemoved, {
        foreignKey: 'product_order_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  ProductOrderEntity.init({
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
    modelName: 'ProductOrderEntity',
  });
  return ProductOrderEntity;
};