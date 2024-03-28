import { DataTypes } from 'sequelize';
import Database from './Database.js';

const CartProductEntity = Database.define("CartProductEntity", {
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

export default CartProductEntity;
