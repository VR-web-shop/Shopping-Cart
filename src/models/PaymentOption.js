import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const PAYMENT_OPTIONS = {
    CREDIT_CARD: { name: 'Credit Card', price: 0 },
    PAYPAL: { name: 'Paypal', price: 0 },
    BANK_TRANSFER: { name: 'Bank Transfer', price: 0 },
}

const PaymentOption = Database.define("PaymentOption", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default PaymentOption;
