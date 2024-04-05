import meteor from "@vr-web-shop/meteor";
import CartJWT from "../../../jwt/CartJWT.js";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";
import BrokerServiceProducer from "../../../services/BrokerServiceProducer.js";

import Cart from "../../../models/Cart.js";
import CartState, { CART_STATES } from "../../../models/CartState.js";
import CartProductEntity from "../../../models/CartProductEntity.js";
import ProductEntity from "../../../models/ProductEntity.js";
import ProductEntityState, { PRODUCT_ENTITY_STATES } from "../../../models/ProductEntityState.js";
import ProductOrder from "../../../models/ProductOrder.js";
import ProductOrderEntity from "../../../models/ProductOrderEntity.js";
import ProductOrderState, { PRODUCT_ORDER_STATES } from "../../../models/ProductOrderState.js";
import DeliverOption, { DELIVER_OPTIONS } from "../../../models/DeliverOption.js";
import PaymentOption, { PAYMENT_OPTIONS } from "../../../models/PaymentOption.js";

const prefix = '/api/v1/';
const RestController = meteor.RestController;
const debug = true;

export default {
    CartController: RestController(`${prefix}carts`, 'uuid', Cart, {
        find: { 
            middleware: [
                CartJWT.AuthorizeJWTCart
            ],
            includes: [
                { endpoint: 'product_entities', model: 'ProductEntity' },
                { endpoint: 'cart_states', model: 'CartState' }
            ]
        },
        findAll: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('shopping-cart:carts:index')
            ], 
            findProperties: ['uuid'],
            whereProperties: ['uuid'],
            includes: ['CartState', 'ProductEntity']
        },
        create: { 
            properties: [], 
            middleware: [],
            customResponse: (cart) => {
                // Everyone can create a new cart. To access the cart,
                // they receive a specific access token with the cart's uuid
                // that is used to authenticate the cart on management.
                const access_token = CartJWT.NewCartAuthentication(cart.uuid)
                return { cart, access_token }
            }
        },
        update: {
            properties: ['cart_state_name', 'access_token'],
            middleware: [
                CartJWT.AuthorizeJWTCart
            ],
            customResponse: async (cart) => {
                // If the cart is closed, we should cancel all open orders
                if (cart.cart_state_name === CART_STATES.OPEN_FOR_PRODUCT_ENTITIES) {
                    // If the customer has any open orders and they cancel the checkout,
                    // we should cancel the orders as well.
                    const openProductOrders = await ProductOrder.findAll({ where: { cart_uuid: cart.uuid, product_order_state_name: PRODUCT_ORDER_STATES.WAITING_FOR_PAYMENT } });
                    for (const openProductOrder of openProductOrders) {
                        await openProductOrder.update({ product_order_state_name: PRODUCT_ORDER_STATES.CANCELLED_BY_CUSTOMER });
                        await BrokerServiceProducer.updateProductOrder(openProductOrder);
                    }
                }

                return cart;
            }
        },
        delete: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT, 
                MiddlewareJWT.AuthorizePermissionJWT('shopping-cart:carts:delete')
            ],
        },
        debug
    }),

    CartStateController: RestController(`${prefix}cart_states`, 'name', CartState, {
        find: { 
            middleware: [], 
            includes: ['Cart'] 
        },
        findAll: {
            middleware: [],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['Cart']
        },
        debug
    }),

    CartProductEntityController: RestController(`${prefix}cart_product_entities`, 'uuid', CartProductEntity, {
        findAll: {
            middleware: [CartJWT.AuthorizeJWTCart],
            findProperties: ['cart_uuid', 'product_entity_uuid'],
            whereProperties: ['cart_uuid', 'product_entity_uuid'],
            includes: ['Cart', 'ProductEntity']
        },
        /**
         * Users can create cart product entities for the product's they
         * want to add to their cart.
         */
        create: {
            properties: ['cart_uuid', 'product_entity_uuid', 'access_token'],
            middleware: [CartJWT.AuthorizeJWTCart],
            customMethod: async (req, res, params) => {
                console.log(params);
                const cart_uuid = params.body.cart_uuid;
                const product_entity_uuid = params.body.product_entity_uuid;
                
                const cartProductEntity = await CartProductEntity.findOne({ where: { 
                    cart_uuid, 
                    product_entity_uuid
                }});

                if (cartProductEntity) {
                    return cartProductEntity.dataValues;
                }

                const result = CartProductEntity.create({
                    cart_uuid, 
                    product_entity_uuid
                });

                return result; 
            },
            customResponse: async (cartProductEntity) => {
                // Let everyone know that the product entity is reserved by the customer
                const productEntity = await ProductEntity.findOne({ where: { uuid: cartProductEntity.product_entity_uuid } });
                const result = await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.RESERVERED_BY_CUSTOMER_CART })
                await BrokerServiceProducer.updateProductEntity(result);

                return cartProductEntity;
            }
        },

        /**
         * Users can remove cart product entities from their cart.
         */
        update: {
            properties: ['access_token'],
            middleware: [CartJWT.AuthorizeJWTCart],
            customResponse: async (cartProductEntity) => {
                // Let everyone know that the product entity is released by the customer
                const productEntity = await ProductEntity.findOne({ where: { uuid: cartProductEntity.product_entity_uuid } });
                const result = await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.AVAILABLE_FOR_PURCHASE })
                await BrokerServiceProducer.updateProductEntity(result);

                // This should properly be a delete request, but the SDK generator,
                // does not support parameters in the delete request besides the foreign key,
                // making it a bit more difficult to include the access token :-).
                await CartProductEntity.destroy({ where: { uuid: cartProductEntity.uuid } });
                return { message: 'Product entity removed from cart' };
            }
        },
        debug
    }),

    ProductOrderController: RestController(`${prefix}product_orders`, 'uuid', ProductOrder, {
        find: {
            middleware: [],
            includes: [
                { endpoint: 'product_order_entities', model: 'ProductOrderEntity' },
                { endpoint: 'product_order_states', model: 'ProductOrderState' },
                { endpoint: 'deliver_options', model: 'DeliverOption' },
                { endpoint: 'payment_options', model: 'PaymentOption' }
            ]
        },
        findAll: {
            middleware: [],
            findProperties: ['uuid', 'cart_uuid', 'product_order_state_name'],
            whereProperties: ['uuid', 'cart_uuid', 'product_order_state_name'],
            includes: ['ProductOrderState', 'ProductOrderEntity'],
        },
        create: {
            properties: ['name', 'email', 'address', 'city', 'country', 'postal_code', 'deliver_option_name', 'payment_option_name', 'cart_uuid'],
            middleware: [],
            hooks: {
                after: async (req, res, params, entity) => {
                    await BrokerServiceProducer.newProductOrder(entity);
                }
            }
        },
        update: {
            properties: ['name', 'email', 'address', 'city', 'product_order_state_name', 'country', 'postal_code', 'deliver_option_name', 'payment_option_name', 'cart_uuid'],
            middleware: [],
            hooks: {
                after: async (req, res, params, entity) => {
                    console.log(entity.product_order_state_name);
                    /**
                     * The current implementation of the shopping cart does only support mock purchases.
                     * This means that if a proder order's state is moved to 'WAITING_FOR_PAYMENT', this
                     * is considered a successful purchase. In a real-world scenario, this would have
                     * to go through a payment gateway and the state would be updated based on the payment
                     * gateway's response.
                     */
                    if (entity.product_order_state_name === PRODUCT_ORDER_STATES.WAITING_FOR_SHIPMENT) {
                        const cartProductEntities = await CartProductEntity.findAll({ where: { cart_uuid: entity.cart_uuid } });
                        const productEntities = await ProductEntity.findAll({ where: { uuid: cartProductEntities.map(cpe => cpe.product_entity_uuid) } });
                        for (const productEntity of productEntities) {
                            const result = await productEntity.update({ product_entity_state_name: PRODUCT_ENTITY_STATES.RESERVERED_BY_CUSTOMER_ORDER })
                            await BrokerServiceProducer.updateProductEntity(result);
                        }

                        // Change the cart state to OPEN_FOR_PRODUCT_ENTITIES
                        const cart = await Cart.findOne({ where: { uuid: entity.cart_uuid } });
                        await cart.update({ cart_state_name: CART_STATES.OPEN_FOR_PRODUCT_ENTITIES });
                        // Remove the cart product entities
                        await CartProductEntity.destroy({ where: { cart_uuid: entity.cart_uuid } });
                    }

                    await BrokerServiceProducer.updateProductOrder(entity);
                }
            }
        },
        debug
    }),

    ProductOrderEntityController: RestController(`${prefix}product_order_entities`, 'uuid', ProductOrderEntity, {
        find: {
            middleware: [],
            includes: [
                { endpoint: 'product_orders', model: 'ProductOrder' },
                { endpoint: 'product_entities', model: 'ProductEntity' }
            ]
        },
        findAll: {
            middleware: [],
            findProperties: ['uuid', 'product_order_uuid'],
            whereProperties: ['uuid', 'product_order_uuid'],
            includes: ['ProductOrder', 'ProductEntity'],
        },
        debug
    }),

    ProductOrderStateController: RestController(`${prefix}product_order_states`, 'name', ProductOrderState, {
        find: {
            middleware: [],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),

    DeliverOptionController: RestController(`${prefix}deliver_options`, 'name', DeliverOption, {
        find: {
            middleware: [],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),

    PaymentOptionController: RestController(`${prefix}payment_options`, 'name', PaymentOption, {
        find: {
            middleware: [],
            includes: ['ProductOrder'],
        },
        findAll: {
            middleware: [],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductOrder'],
        },
        debug
    }),

    ProductEntityController: RestController(`${prefix}product_entities`, 'uuid', ProductEntity, {
        find: {
            middleware: [],
            includes: ['ProductEntityState', 'Cart'],
            serviceOnly: true,
        },
        findAll: {
            middleware: [],
            findProperties: ['uuid'],
            whereProperties: ['uuid'],
            includes: ['ProductEntityState', 'Cart', 'Product'],
        },
        create: {
            properties: ['uuid', 'product_entity_state_name'],
            middleware: [],
            serviceOnly: true,
        },
        update: {
            properties: ['product_entity_state_name'],
            middleware: [],
            serviceOnly: true,
        },
        delete: {
            middleware: [],
            serviceOnly: true,
        },
        debug
    }),

    ProductEntityStateController: RestController(`${prefix}product_entity_states`, 'name', ProductEntityState, {
        find: {
            middleware: [],
            includes: ['ProductEntity'],
            serviceOnly: true,
        },
        findAll: {
            middleware: [],
            findProperties: ['name'],
            whereProperties: ['name'],
            includes: ['ProductEntity'],
            serviceOnly: true,
        },
        debug
    }),
}
