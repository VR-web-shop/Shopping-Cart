'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductOrderEntityDescription extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      models.ProductOrderEntityDescription.belongsTo(models.ProductOrder, { 
        foreignKey: 'product_order_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductOrderEntityDescription.belongsTo(models.ProductEntity, { 
        foreignKey: 'product_entity_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      models.ProductOrderEntityDescription.belongsTo(models.ProductOrderEntity, { 
        foreignKey: 'product_order_entity_client_side_uuid', 
        targetKey: 'client_side_uuid'
      });
      /*
      models.ProductOrderEntityDescription.belongsToMany(models.ProductOrder, {
        through: models.ProductOrderDescription,
        foreignKey: 'product_order_client_side_uuid',
        otherKey: 'client_side_uuid'
      });
      models.ProductOrderEntityDescription.belongsToMany(models.ProductEntity, {
        through: models.ProductEntityDescription,
        foreignKey: 'product_entity_client_side_uuid',
        otherKey: 'client_side_uuid'
      });
      models.ProductOrderEntityDescription.belongsToMany(models.ProductOrderEntity, {
        through: models.ProductOrderEntityDescription,
        foreignKey: 'product_order_entity_client_side_uuid',
        otherKey: 'client_side_uuid'
      });*/
    }
  }
  ProductOrderEntityDescription.init({
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
    product_order_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_entity_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
    product_order_entity_client_side_uuid: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'ProductOrderEntityDescription',
  });
  return ProductOrderEntityDescription;
};