import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntity from './ProductEntity.js';
import ProductOrderEntity from './ProductOrderEntity.js';
import ProductOrderState, { PRODUCT_ORDER_STATES} from './ProductOrderState.js';
import Cart from './Cart.js';

const ProductOrder = Database.define("ProductOrder", {
    uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true
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
    deliveryOption: {
        type: DataTypes.STRING,
        allowNull: false
    },
    paymentMethod: {
        type: DataTypes.STRING,
        allowNull: false
    },
}, {
    hooks: {
        beforeCreate: async (productOrder) => {
            if (!productOrder.product_order_state_name) {
                productOrder.product_order_state_name = PRODUCT_ORDER_STATES.WAITING_FOR_PAYMENT;
            }

            // Add all products from the cart to the product order
            const cart = await Cart.findOne({ where: { uuid: productOrder.cart_uuid }, include: ProductEntity });
            for (const productEntity of cart.ProductEntity) {
                await ProductOrderEntity.create({
                    product_order_uuid: productOrder.uuid,
                    product_entity_uuid: productEntity.uuid
                });
            }
        },
        beforeUpdate: async (productOrder) => {
            // Delete all ProductOrderEntity instances associated with this ProductOrder
            await ProductOrderEntity.destroy({ where: { product_order_uuid: productOrder.uuid } });
            // Create new ProductOrderEntity instances associated with this ProductOrder
            const cart = await Cart.findOne({ where: { uuid: productOrder.cart_uuid }, include: ProductEntity });
            for (const productEntity of cart.ProductEntity) {
                await ProductOrderEntity.create({
                    product_order_uuid: productOrder.uuid,
                    product_entity_uuid: productEntity.uuid
                });
            }
        }
    },
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ProductOrder.belongsTo(Cart);
Cart.hasMany(ProductOrder);

ProductOrder.belongsTo(ProductOrderState);
ProductOrderState.hasMany(ProductOrder);

ProductOrder.belongsToMany(ProductEntity, { through: ProductOrderEntity });
ProductEntity.belongsToMany(ProductOrder, { through: ProductOrderEntity });

ProductOrder.hasMany(ProductOrderEntity);
ProductEntity.hasMany(ProductOrderEntity);

ProductOrderEntity.belongsTo(ProductOrder, { foreignKey: 'product_order_uuid', targetKey: 'uuid', as: 'ProductOrder' });
ProductOrderEntity.belongsTo(ProductEntity, { foreignKey: 'product_entity_uuid', targetKey: 'uuid', as: 'ProductEntity' });

export default ProductOrder;
