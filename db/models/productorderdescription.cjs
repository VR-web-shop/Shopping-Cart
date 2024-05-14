'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrderDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOrderDescription.belongsTo(models.ProductOrder, { 
        foreignKey: 'product_order_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductOrderDescription.belongsTo(models.DeliverOption, { 
        foreignKey: 'deliver_option_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductOrderDescription.belongsTo(models.PaymentOption, { 
        foreignKey: 'payment_option_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductOrderDescription.belongsTo(models.ProductOrderState, {
        foreignKey: 'product_order_state_name',
        targetKey: 'name'
      });
    }
  }
  ProductOrderDescription.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false
    },
    postal_code: {
      type: DataTypes.STRING,
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
    product_order_state_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    deliver_option_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    payment_option_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_order_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distributed_transaction_transaction_uuid: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'ProductOrderDescription',
  });
  return ProductOrderDescription;
};
