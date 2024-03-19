import 'dotenv/config'
import database from './src/models/Database.js';

import Cart from './src/models/Cart.js';
import CartProductEntity from './src/models/CartProductEntity.js';
import CartState, { CART_STATES } from './src/models/CartState.js';

(async () => {
    await database.sync({ force: true });

    for (const cartStateName of Object.values(CART_STATES)) {
        await CartState.findOrCreate({ where: { name: cartStateName } });
    }

    await (async () => {
        const product_entity_uuid = '123e4567-e89b-12d3-a456-426614174000';
        const cartStateName = CART_STATES.WAITING_FOR_PAYMENT_APPROVAL;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await CartProductEntity.findOrCreate({ where: { product_entity_uuid, cart_uuid } });
    })();

    await (async () => {
        const product_entity_uuid = '123e4567-e89b-12d3-a456-426614174001';
        const cartStateName = CART_STATES.PAYMENT_APPROVED;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await CartProductEntity.findOrCreate({ where: { product_entity_uuid, cart_uuid } });
    })();

    await (async () => {
        const product_entity_uuid = '123e4567-e89b-12d3-a456-426614174002';
        const cartStateName = CART_STATES.PAYMENT_CANCELLED;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await CartProductEntity.findOrCreate({ where: { product_entity_uuid, cart_uuid } });
    })();

    await (async () => {
        const product_entity_uuid = '123e4567-e89b-12d3-a456-426614174003';
        const cartStateName = CART_STATES.WAITING_FOR_PRODUCT_ENTITIES;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await CartProductEntity.findOrCreate({ where: { product_entity_uuid, cart_uuid } });
    })();
})();
