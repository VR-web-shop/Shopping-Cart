'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DistributedTransaction extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DistributedTransaction.belongsTo(models.DistributedTransactionState, {
        foreignKey: 'distributed_transaction_state_name',
        targetKey: 'name'
      });
      models.DistributedTransaction.hasMany(models.DeliverOptionDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
      models.DistributedTransaction.hasMany(models.PaymentOptionDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
      models.DistributedTransaction.hasMany(models.ProductDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
      models.DistributedTransaction.hasMany(models.ProductEntityDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
      models.DistributedTransaction.hasMany(models.ProductOrderDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
      models.DistributedTransaction.hasMany(models.ProductOrderEntityDescription, {
        foreignKey: 'distributed_transaction_transaction_uuid',
      });
    }
  }
  DistributedTransaction.init({
    transactionUUID: {
      type: DataTypes.STRING,
      field: 'transaction_uuid',
      primaryKey: true
    },
    distributed_transaction_state_name: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    transaction_message: {
      type: DataTypes.TEXT,
      allowNull: true
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
    modelName: 'DistributedTransaction',
  });
  return DistributedTransaction;
};