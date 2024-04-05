import { sendMessage } from "../config/BrokerConfig.js";
import ProductOrderEntity from "../models/ProductOrderEntity.js";

const CONSUMERS = {
    PRODUCTS: 'products',
    SCENES: 'scenes',
}

const QUEUES = {
    UPDATE_PRODUCT_ENTITY: 'update_product_entity',
    NEW_PRODUCT_ORDER: 'new_product_order',
    UPDATE_PRODUCT_ORDER: 'update_product_order',
}

/**
 * @function updateProductEntity
 * @param {Object} productEntity
 * @returns {Promise<void>}
 */
async function updateProductEntity(productEntity) {
    const queue = QUEUES.UPDATE_PRODUCT_ENTITY;
    const consumers = [CONSUMERS.PRODUCTS, CONSUMERS.SCENES];

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, productEntity);
    }
}

/**
 * @function newProductOrder
 * @param {Object} productOrder
 * @returns {Promise<void>}
 */
async function newProductOrder(productOrder) {
    const queue = QUEUES.NEW_PRODUCT_ORDER;
    const consumers = [CONSUMERS.PRODUCTS];
    const productOrderEntities = await ProductOrderEntity.findAll({ where: { product_order_uuid: productOrder.uuid } });
    const payload = { productOrder, productOrderEntities };

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, payload);
    }
}

/**
 * @function updateProductOrder
 * @param {Object} productOrder
 * @returns {Promise<void>}
 */
async function updateProductOrder(productOrder) {
    const queue = QUEUES.UPDATE_PRODUCT_ORDER;
    const consumers = [CONSUMERS.PRODUCTS];
    const productOrderEntities = await ProductOrderEntity.findAll({ where: { product_order_uuid: productOrder.uuid } });
    const payload = { productOrder, productOrderEntities };

    for (const consumer of consumers) {
        sendMessage(`${consumer}_${queue}`, payload);
    }
}

export default {
    updateProductEntity,
    newProductOrder,
    updateProductOrder,
}
