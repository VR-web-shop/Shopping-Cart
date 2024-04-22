'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartProductEntity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CartProductEntity.hasMany(models.CartProductEntityRemoved, {
        foreignKey: 'cart_product_entity_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.CartProductEntity.belongsTo(models.Cart, {
        foreignKey: 'cart_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
      models.CartProductEntity.belongsTo(models.ProductEntity, {
        foreignKey: 'product_entity_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
    }
  }
  CartProductEntity.init({
    client_side_uuid: {
      type: DataTypes.STRING,
      field: 'client_side_uuid',
      primaryKey: true
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    cart_client_side_uuid: {
      type: DataTypes.STRING,
      field: 'cart_client_side_uuid',
    },
    product_entity_client_side_uuid: {
      type: DataTypes.STRING,
      field: 'product_entity_client_side_uuid',
    },
  }, {
    sequelize,
    modelName: 'CartProductEntity',
  });
  return CartProductEntity;
};