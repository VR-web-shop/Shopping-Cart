import { DataTypes } from 'sequelize';
import Database from './Database.js';
import ProductEntity from './ProductEntity.js';
import ProductOrderEntity from './ProductOrderEntity.js';
import ProductOrderState, { PRODUCT_ORDER_STATES} from './ProductOrderState.js';
import DeliverOption from './DeliverOption.js';
import PaymentOption from './PaymentOption.js';
import Cart from './Cart.js';

const ProductOrder = Database.define("ProductOrder", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
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
}, {
    hooks: {
        beforeCreate: async (productOrder) => {
            if (!productOrder.dataValues.product_order_state_name) {
                productOrder.dataValues.product_order_state_name = PRODUCT_ORDER_STATES.WAITING_FOR_PAYMENT;
            }
        },
        afterCreate: async (productOrder) => {
            const cart = await Cart.findOne({ where: { uuid: productOrder.dataValues.cart_uuid }, include: [
                { model: ProductEntity, as: 'ProductEntity' }            
            ]});
            
            for (const productEntity of cart.ProductEntity) {
                // delete any existing product order entity with the same product entity uuid
                await ProductOrderEntity.destroy({ where: { product_entity_uuid: productEntity.dataValues.uuid } });
                await ProductOrderEntity.findOrCreate({ where: {
                    product_order_uuid: productOrder.dataValues.uuid,
                    product_entity_uuid: productEntity.dataValues.uuid
                }});
            }
        },
        beforeUpdate: async (productOrder) => {
            await ProductOrderEntity.destroy({ where: { product_order_uuid: productOrder.dataValues.uuid } });
            const cart = await Cart.findOne({ where: { uuid: productOrder.dataValues.cart_uuid }, include: [
                { model: ProductEntity, as: 'ProductEntity' }            
            ]});
            for (const productEntity of cart.ProductEntity) {
                
                await ProductOrderEntity.destroy({ where: { 
                    product_entity_uuid: productEntity.dataValues.uuid,
                    product_order_uuid: productOrder.dataValues.uuid
                }});

                await ProductOrderEntity.create({
                    product_order_uuid: productOrder.dataValues.uuid,
                    product_entity_uuid: productEntity.dataValues.uuid
                });
            }
        }
    },
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

ProductOrder.belongsTo(DeliverOption, { foreignKey: 'deliver_option_name', targetKey: 'name', as: 'DeliverOption' });
DeliverOption.hasMany(ProductOrder);

ProductOrder.belongsTo(PaymentOption, { foreignKey: 'payment_option_name', targetKey: 'name', as: 'PaymentOption' });
PaymentOption.hasMany(ProductOrder);

ProductOrder.belongsTo(Cart, { foreignKey: 'cart_uuid', targetKey: 'uuid' });
Cart.hasMany(ProductOrder);

ProductOrder.belongsTo(ProductOrderState, { foreignKey: 'product_order_state_name', targetKey: 'name' });
ProductOrderState.hasMany(ProductOrder);

ProductOrder.belongsToMany(ProductEntity, { through: ProductOrderEntity });
ProductEntity.belongsToMany(ProductOrder, { through: ProductOrderEntity });

ProductOrder.hasMany(ProductOrderEntity);
ProductEntity.hasMany(ProductOrderEntity);

ProductOrderEntity.belongsTo(ProductOrder, { foreignKey: 'product_order_uuid', targetKey: 'uuid', as: 'ProductOrder' });
ProductOrderEntity.belongsTo(ProductEntity, { foreignKey: 'product_entity_uuid', targetKey: 'uuid', as: 'ProductEntity' });

export default ProductOrder;
