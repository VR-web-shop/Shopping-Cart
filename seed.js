import 'dotenv/config'
import database from './src/models/Database.js';

import Cart from './src/models/Cart.js';
import ProductEntity from './src/models/ProductEntity.js';
import ProductEntityState, { PRODUCT_ENTITY_STATES } from './src/models/ProductEntityState.js';
import CartState, { CART_STATES } from './src/models/CartState.js';

(async () => {
    await database.sync({ force: true });

    for (const cartStateName of Object.values(CART_STATES)) {
        await CartState.findOrCreate({ where: { name: cartStateName } });
    }

    for (const productEntityStateName of Object.values(PRODUCT_ENTITY_STATES)) {
        await ProductEntityState.findOrCreate({ where: { name: productEntityStateName } });
    }

    await (async () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174000';
        const cartStateName = CART_STATES.OPEN_FOR_PRODUCT_ENTITIES;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await ProductEntity.findOrCreate({ where: { uuid, cart_uuid, product_entity_state_name: PRODUCT_ENTITY_STATES.RESERVERED_BY_CUSTOMER_CART } });
    })();

    await (async () => {
        const uuid = '123e4567-e89b-12d3-a456-426614174001';
        const cartStateName = CART_STATES.WAITING_FOR_CHECKOUT;
        const cart = await Cart.findOrCreate({ where: { cart_state_name: cartStateName } });
        const cart_uuid = cart[0].dataValues.uuid;
        await ProductEntity.findOrCreate({ where: { uuid, cart_uuid, product_entity_state_name: PRODUCT_ENTITY_STATES.RESERVERED_BY_CUSTOMER_CART } });
    })();
})();
