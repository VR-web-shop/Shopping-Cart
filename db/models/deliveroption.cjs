'use strict';
const {
  Model,
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DeliverOption extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.DeliverOption.hasMany(models.DeliverOptionDescription, {
        foreignKey: 'deliver_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.DeliverOption.hasMany(models.DeliverOptionRemoved, {
        foreignKey: 'deliver_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
      models.DeliverOption.hasMany(models.ProductOrderDescription, {
        foreignKey: 'deliver_option_client_side_uuid',
        sourceKey: 'client_side_uuid',
      });
    }
  }
  DeliverOption.init({
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
    modelName: 'DeliverOption',
  });
  return DeliverOption;
};