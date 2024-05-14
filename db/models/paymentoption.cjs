'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PaymentOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.PaymentOption.hasMany(models.PaymentOptionDescription, {
        foreignKey: 'payment_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.PaymentOption.hasMany(models.PaymentOptionRemoved, {
        foreignKey: 'payment_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.PaymentOption.hasMany(models.ProductOrderDescription, {
        foreignKey: 'payment_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  PaymentOption.init({
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
    modelName: 'PaymentOption',
  });
  return PaymentOption;
};