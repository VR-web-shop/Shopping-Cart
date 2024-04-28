'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CartState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.CartState.hasMany(models.CartDescription, {
        foreignKey: 'cart_state_name',
        sourceKey: 'name',
      });
    }
  }
  CartState.init({
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    created_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'created_at',
    },
    updated_at: {
      allowNull: false,
      type: DataTypes.DATE,
      field: 'updated_at',
    },
  }, {
    sequelize,
    modelName: 'CartState',
    createdAt: 'created_at',
    updatedAt: 'updated_at',
  });
  return CartState;
};