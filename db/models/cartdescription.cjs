'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CartDescription.belongsTo(models.Cart, {
        foreignKey: 'cart_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
      models.CartDescription.belongsTo(models.CartState, {
        foreignKey: 'cart_state_name',
        targetKey: 'name'
      });
      models.CartDescription.belongsTo(models.ProductOrder, {
        foreignKey: 'product_order_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
    }
  }
  CartDescription.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updatedAt: {
      type: DataTypes.DATE,
      field: 'updated_at',
    },
    cart_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    cart_state_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    product_order_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'CartDescription',
  });
  return CartDescription;
};