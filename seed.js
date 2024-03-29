import 'dotenv/config'
import database from './src/models/Database.js';

import Cart from './src/models/Cart.js';
import CartState, { CART_STATES } from './src/models/CartState.js';
import CartProductEntity from './src/models/CartProductEntity.js';
import Product from './src/models/Product.js';
import ProductEntity from './src/models/ProductEntity.js';
import ProductEntityState, { PRODUCT_ENTITY_STATES } from './src/models/ProductEntityState.js';

(async () => {
    await database.sync({ force: true });

    for (const cartStateName of Object.values(CART_STATES)) {
        await CartState.findOrCreate({ where: { name: cartStateName } });
    }

    for (const productEntityStateName of Object.values(PRODUCT_ENTITY_STATES)) {
        await ProductEntityState.findOrCreate({ where: { name: productEntityStateName } });
    }
})();
