import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const PRODUCT_ORDER_STATES = {
    WAITING_FOR_PAYMENT: 'WAITING_FOR_PAYMENT',
    WAITING_FOR_SHIPMENT: 'WAITING_FOR_SHIPMENT',
    SHIPPED_TO_CUSTOMER: 'SHIPPED_TO_CUSTOMER',
    DISCARDED_BY_EMPLOYEE: 'DISCARDED_BY_EMPLOYEE',
}

const ProductOrderState = Database.define("ProductOrderState", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default ProductOrderState;
