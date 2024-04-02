import 'dotenv/config'
import database from './src/models/Database.js';

import Cart from './src/models/Cart.js';
import CartState, { CART_STATES } from './src/models/CartState.js';
import CartProductEntity from './src/models/CartProductEntity.js';
import Product from './src/models/Product.js';
import ProductEntity from './src/models/ProductEntity.js';
import ProductEntityState, { PRODUCT_ENTITY_STATES } from './src/models/ProductEntityState.js';
import ProductOrder from './src/models/ProductOrder.js';
import ProductOrderState, { PRODUCT_ORDER_STATES } from './src/models/ProductOrderState.js';
import ProductOrderEntity from './src/models/ProductOrderEntity.js';
import DeliverOption, { DELIVER_OPTIONS } from './src/models/DeliverOption.js';
import PaymentOption, { PAYMENT_OPTIONS } from './src/models/PaymentOption.js';

(async () => {
    await database.sync({ force: true });

    for (const cartStateName of Object.values(CART_STATES)) {
        await CartState.findOrCreate({ where: { name: cartStateName } });
    }

    for (const productEntityStateName of Object.values(PRODUCT_ENTITY_STATES)) {
        await ProductEntityState.findOrCreate({ where: { name: productEntityStateName } });
    }

    for (const productOrderStateName of Object.values(PRODUCT_ORDER_STATES)) {
        await ProductOrderState.findOrCreate({ where: { name: productOrderStateName } });
    }

    for (const deliverOption of Object.values(DELIVER_OPTIONS)) {
        await DeliverOption.findOrCreate({ where: deliverOption });
    }

    for (const paymentOption of Object.values(PAYMENT_OPTIONS)) {
        await PaymentOption.findOrCreate({ where: paymentOption });
    }
})();
