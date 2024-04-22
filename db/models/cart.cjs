'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.Cart.hasMany(models.CartDescription, {
        foreignKey: 'cart_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.Cart.hasMany(models.CartProductEntity, {
        foreignKey: 'cart_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  Cart.init({
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
  }, {
    sequelize,
    modelName: 'Cart',
  });
  return Cart;
};