'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliverOptionDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DeliverOptionDescription.belongsTo(models.DeliverOption, {
        foreignKey: 'deliver_option_client_side_uuid',
        targetKey: 'client_side_uuid'
      });
    }
  }
  DeliverOptionDescription.init({
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
    price: {
      type: DataTypes.FLOAT,
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
    deliver_option_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    distributed_transaction_transaction_uuid: {
      type: DataTypes.STRING,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'DeliverOptionDescription',
  });
  return DeliverOptionDescription;
};