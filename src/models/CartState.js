import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const CART_STATES = {
    OPEN_FOR_PRODUCT_ENTITIES: 'OPEN_FOR_PRODUCT_ENTITIES',
    WAITING_FOR_CHECKOUT: 'WAITING_FOR_CHECKOUT',
}

const CartState = Database.define("CartState", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default CartState;
