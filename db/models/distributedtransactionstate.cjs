'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DistributedTransactionState extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DistributedTransactionState.hasMany(models.DistributedTransaction, {
        foreignKey: 'distributed_transaction_state_name',
        sourceKey: 'name'
      });
    }
  }
  DistributedTransactionState.init({
    name: {
      allowNull: false,
      primaryKey: true,
      type: DataTypes.STRING
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE
    }
  }, {
    sequelize,
    modelName: 'DistributedTransactionState',
  });
  return DistributedTransactionState;
};