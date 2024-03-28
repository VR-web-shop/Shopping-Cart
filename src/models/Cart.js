import { DataTypes } from 'sequelize';
import Database from './Database.js';
import CartState from './CartState.js';
import CartProductEntity from './CartProductEntity.js';
import ProductEntity from './ProductEntity.js';

const Cart = Database.define("Cart", {
    uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
}, {
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
