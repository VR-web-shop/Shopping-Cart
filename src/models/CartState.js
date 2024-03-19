
import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const CART_STATES = {
    WAITING_FOR_PRODUCT_ENTITIES: 'Waiting for Product Entities',
    WAITING_FOR_PAYMENT_APPROVAL: 'Waiting for Payment Approval',
    PAYMENT_APPROVED: 'Payment Approved',
    PAYMENT_CANCELLED: 'Payment Cancelled',
};

const CartState = Database.define("CartState", {
    name: {
        type: DataTypes.STRING,
        allowNull: false, 
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default CartState;
