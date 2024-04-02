import pkg from 'amqplib';

import Product from '../../src/models/Product.js';
import ProductEntity from '../../src/models/ProductEntity.js';
import ProductOrder from '../models/ProductOrder.js';
import ProductOrderEntity from '../models/ProductOrderEntity.js';
import { PRODUCT_ORDER_STATES } from '../models/ProductOrderState.js';
import CartProductEntity from '../models/CartProductEntity.js';

const url = process.env.MESSAGE_BROKER_URL;
const queues = [];
let ch, conn;

export const addListener = (queueName, callback) => {
    if (queues.includes(queueName)) {
        throw new Error(`Queue ${queueName} is already being listened to.`);
    }

    queues.push(queueName);
    ch.assertQueue(queueName, { durable: false });
    ch.consume(queueName, (msg) => {
        const text = msg.content.toString();
        const json = JSON.parse(text);
        callback(json);
    }, { noAck: true });
};

export const removeListener = (queueName) => {
    ch.cancel(queueName);
};

export const sendMessage = (queueName, msg) => {
    const text = JSON.stringify(msg);

    ch.assertQueue(queueName, { durable: false });
    ch.sendToQueue(queueName, Buffer.from(text));
};

export const connect = async () => {
    conn = await pkg.connect(url);
    ch = await conn.createChannel();

    /**
     * When an employee creates a new product,
     * the shopping cart's application receives a message to create a new product.
     */
    addListener('shopping_cart_new_product', async (msg) => await Product.create(msg));

    /**
     * When an employee creates a new product entity,
     * the shopping cart's application receives a message to create a new product entity.
     */
    addListener('shopping_cart_new_product_entity', async (msg) => await ProductEntity.create(msg))

    /**
     * When an employee updates a product entity,
     * the shopping cart's application receives a message to update the product entity's state.
     */
    addListener('shopping_cart_update_product_entity', async (msg) => {
        const uuid = msg.uuid;
        const entity = await ProductEntity.findOne({ where: { uuid } });
        await entity.update({
            product_entity_state_name: msg.product_entity_state_name
        });
    })

    /**
     * When an employee updates a product order,
     * the shopping cart's application receives a message to update the product order.
     */
    addListener('shopping_cart_update_product_order', async (msg) => {
        msg.ProductOrderStateName = msg.product_order_state_name;
        await ProductOrder.update(msg, { where: { uuid: msg.uuid } });
    })
}
