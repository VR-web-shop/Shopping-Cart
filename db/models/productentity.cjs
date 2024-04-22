'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductEntity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductEntity.hasMany(models.ProductEntityDescription, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductEntity.hasMany(models.ProductEntityRemoved, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductEntity.hasMany(models.ProductOrderEntityDescription, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductEntity.hasMany(models.CartProductEntity, {
        foreignKey: 'product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  ProductEntity.init({
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
    modelName: 'ProductEntity'
  });
  return ProductEntity;
};