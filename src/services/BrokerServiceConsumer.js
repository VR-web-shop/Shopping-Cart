import Product from '../models/Product.js';
import ProductEntity from '../models/ProductEntity.js';
import ProductOrder from '../models/ProductOrder.js';
import ProductOrderEntity from '../models/ProductOrderEntity.js';
import CartProductEntity from '../models/CartProductEntity.js';

const TYPES = {
    SHOPPING_CART_NEW_PRODUCT: 'shopping_cart_new_product',
    SHOPPING_CART_UPDATE_PRODUCT: 'shopping_cart_update_product',
    SHOPPING_CART_DELETE_PRODUCT: 'shopping_cart_delete_product',
    SHOPPING_CART_NEW_PRODUCT_ENTITY: 'shopping_cart_new_product_entity',
    SHOPPING_CART_UPDATE_PRODUCT_ENTITY: 'shopping_cart_update_product_entity',
    SHOPPING_CART_DELETE_PRODUCT_ENTITY: 'shopping_cart_delete_product_entity',
    SHOPPING_CART_UPDATE_PRODUCT_ORDER: 'shopping_cart_update_product_order',
    SHOPPING_CART_DELETE_PRODUCT_ORDER: 'shopping_cart_delete_product_order',
}

const config = [
    { type: TYPES.SHOPPING_CART_NEW_PRODUCT, callback: onNewProduct },
    { type: TYPES.SHOPPING_CART_UPDATE_PRODUCT, callback: onUpdateProduct },
    { type: TYPES.SHOPPING_CART_DELETE_PRODUCT, callback: onDeleteProduct },
    { type: TYPES.SHOPPING_CART_NEW_PRODUCT_ENTITY, callback: onNewProductEntity },
    { type: TYPES.SHOPPING_CART_UPDATE_PRODUCT_ENTITY, callback: onUpdateProductEntity },
    { type: TYPES.SHOPPING_CART_DELETE_PRODUCT_ENTITY, callback: onDeleteProductEntity },
    { type: TYPES.SHOPPING_CART_UPDATE_PRODUCT_ORDER, callback: onUpdateProductOrder },
    { type: TYPES.SHOPPING_CART_DELETE_PRODUCT_ORDER, callback: onDeleteProductOrder },
]

/**
 * @function onNewProduct
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onNewProduct(msg) {
    await Product.create(msg);
}

/**
 * @function onUpdateProduct
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onUpdateProduct(msg) {
    await Product.update(msg, { where: { uuid: msg.uuid } });
}

/**
 * @function onDeleteProduct
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onDeleteProduct(msg) {
    const uuid = msg.uuid;
    await Product.destroy({ where: { uuid } });
    const productEntities = await ProductEntity.findAll({ where: { product_uuid: uuid } });
    for (const entity of productEntities) {
        await entity.destroy();
        await CartProductEntity.destroy({ where: { product_entity_uuid: entity.uuid } });
    }
}

/**
 * @function onNewProductEntity
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onNewProductEntity(msg) {
    await ProductEntity.create(msg);
}

/**
 * @function onUpdateProductEntity
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onUpdateProductEntity(msg) {
    const uuid = msg.uuid;
    const entity = await ProductEntity.findOne({ where: { uuid } });
    await entity.update({
        product_entity_state_name: msg.product_entity_state_name
    });
}

/**
 * @function onDeleteProductEntity
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onDeleteProductEntity(msg) {
    const uuid = msg.uuid;
    const entity = await ProductEntity.findOne({ where: { uuid } });
    await entity.update({
        product_entity_state_name: msg.product_entity_state_name
    });
    await entity.destroy();
    await CartProductEntity.destroy({ where: { product_entity_uuid: uuid } });
}

/**
 * @function onUpdateProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onUpdateProductOrder(msg) {
    msg.ProductOrderStateName = msg.product_order_state_name;
    await ProductOrder.update(msg, { where: { uuid: msg.uuid } });
}

/**
 * @function onDeleteProductOrder
 * @param {Object} msg
 * @returns {Promise<void>}
 */
async function onDeleteProductOrder(msg) {
    msg.ProductOrderStateName = msg.product_order_state_name;
    await ProductOrder.update(msg, { where: { uuid: msg.uuid } });
    await ProductOrder.destroy({ where: { uuid: msg.uuid } });
    await ProductOrderEntity.destroy({ where: { product_order_uuid: msg.uuid } });
}

export default {
    config
}
