import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const PRODUCT_ENTITY_STATES = {
    AVAILABLE_FOR_PURCHASE: 'AVAILABLE_FOR_PURCHASE',
    RESERVERED_BY_CUSTOMER_CART: 'RESERVERED_BY_CUSTOMER_CART',
    RESERVERED_BY_CUSTOMER_ORDER: 'RESERVERED_BT_CUSTOMER_ORDER',
    SHIPPED_TO_CUSTOMER: 'SHIPPED_TO_CUSTOMER',
    DELIVERED_TO_CUSTOMER: 'DELIVERED_TO_CUSTOMER',
    RETURNED_BY_CUSTOMER: 'RETURNED_BY_CUSTOMER',
    DISCARDED_BY_EMPLOYEE: 'DISCARDED_BY_EMPLOYEE',
}

const ProductEntityState = Database.define("ProductEntityState", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default ProductEntityState;
