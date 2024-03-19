import { DataTypes } from 'sequelize';
import Database from './Database.js';
import CartState from './CartState.js';
import CartProductEntity from './CartProductEntity.js';

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


CartProductEntity.belongsTo(Cart, { foreignKey: 'cart_uuid', targetKey: 'uuid' });
Cart.belongsTo(CartState, { foreignKey: 'cart_state_name', targetKey: 'name' });
Cart.hasMany(CartProductEntity);
CartState.hasMany(Cart);

export default Cart;
