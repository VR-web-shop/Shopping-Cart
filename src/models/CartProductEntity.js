import { DataTypes } from 'sequelize';
import Database from './Database.js';

const CartProductEntity = Database.define("CartProductEntity", {
    product_entity_uuid: {
        type: DataTypes.UUID,
        primaryKey: true
    },
}, {
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
});


export default CartProductEntity;
