import { DataTypes } from 'sequelize';
import Database from './Database.js';
import CartState, { CART_STATES } from './CartState.js';
import CartProductEntity from './CartProductEntity.js';
import ProductEntity from './ProductEntity.js';

const Cart = Database.define("Cart", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
}, {
    hooks: {
        beforeCreate: async (cart) => {
            if (cart.cart_state_name === undefined) {
                cart.cart_state_name = CART_STATES.OPEN_FOR_PRODUCT_ENTITIES;
            }
        }
    },
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

Cart.belongsToMany(ProductEntity, { through: CartProductEntity, foreignKey: 'cart_uuid', as: 'ProductEntity' });
CartProductEntity.belongsTo(Cart, { foreignKey: 'cart_uuid' });

ProductEntity.belongsToMany(Cart, { through: CartProductEntity, foreignKey: 'product_entity_uuid', as: 'Cart' });
CartProductEntity.belongsTo(ProductEntity, { foreignKey: 'product_entity_uuid' });

Cart.belongsTo(CartState, { foreignKey: 'cart_state_name', targetKey: 'name' });
CartState.hasMany(Cart);

export default Cart;
