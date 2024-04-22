'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOrder.hasMany(models.ProductOrderDescription, {
        foreignKey: 'product_order_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductOrder.hasMany(models.ProductOrderRemoved, {
        foreignKey: 'product_order_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.ProductOrder.hasMany(models.ProductOrderEntityDescription, {
        foreignKey: 'product_order_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });

      /*
      models.ProductOrder.belongsToMany(models.DeliverOptionDescription, {
        through: models.ProductOrderDescription,
        foreignKey: 'deliver_option_client_side_uuid',
        otherKey: 'product_order_client_side_uuid'
      });
      models.ProductOrder.belongsToMany(models.PaymentOptionDescription, {
        through: models.ProductOrderDescription,
        foreignKey: 'payment_option_client_side_uuid',
        otherKey: 'product_order_client_side_uuid'
      });
      models.ProductOrder.belongsToMany(models.ProductOrderState, {
        through: models.ProductOrderDescription,
        foreignKey: 'product_order_state_name',
        otherKey: 'product_order_client_side_uuid'
      });*/
    }
  }
  ProductOrder.init({
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
    modelName: 'ProductOrder'
  });
  return ProductOrder;
};
