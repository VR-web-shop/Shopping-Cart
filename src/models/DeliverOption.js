import { DataTypes } from 'sequelize';
import Database from './Database.js';

export const DELIVER_OPTIONS = {
    STANDARD_DELIVERY: { name: 'Standard Delivery', price: 10 },
    EXPRESS_DELIVERY: { name: 'Express Delivery', price: 20 },
    PICKUP: { name: 'Pickup', price: 0 },
}

const DeliverOption = Database.define("DeliverOption", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
}, {
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});

export default DeliverOption;
