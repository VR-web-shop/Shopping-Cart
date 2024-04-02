import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntity from './ProductEntity.js';

const Product = Database.define("Product", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false
    },
    thumbnail_source: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL,
        allowNull: false
    },
}, {
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ProductEntity.belongsTo(Product, { foreignKey: 'product_uuid', targetKey: 'uuid', as: 'Product' });
Product.hasMany(ProductEntity);

export default Product;
