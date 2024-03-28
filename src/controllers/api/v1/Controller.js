import meteor from "@vr-web-shop/meteor";
import CartJWT from "../../../jwt/CartJWT.js";
import MiddlewareJWT from "../../../jwt/MiddlewareJWT.js";

import Cart from "../../../models/Cart.js";
import CartState from "../../../models/CartState.js";
import CartProductEntity from "../../../models/CartProductEntity.js";
import ProductEntity from "../../../models/ProductEntity.js";
import ProductEntityState from "../../../models/ProductEntityState.js";

const prefix = '/api/v1/';
const RestController = meteor.RestController;
const debug = false;

export default {
    CartController: RestController(`${prefix}carts`, 'uuid', Cart, {
        find: { 
            middleware: [
                MiddlewareJWT.AuthorizeJWT,
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
        
        /**
         * Users can create cart product entities for the product's they
         * want to add to their cart.
         */
        create: {
            properties: ['cart_uuid', 'product_entity_uuid', 'access_token'],
            middleware: [
                CartJWT.AuthorizeJWTCart,
                async (req, res, next) => {
                    // Check if the product entity is already in the cart
                    // If it is, return an error
                    const cartProductEntities = await CartProductEntity.findAll({
                        where: {
                            cart_uuid: req.body.cart_uuid,
                            product_entity_uuid: req.body.product_entity_uuid
                        }
                    });

                    if (cartProductEntities.length > 0) {
                        return res.status(400).send('Product entity already in a cart');                        
                    }

                    next();
                }
            ]
        },

        /**
         * Users can remove cart product entities from their cart.
         */
        update: {
            properties: ['access_token'],
            middleware: [CartJWT.AuthorizeJWTCart],
            customResponse: async (cartProduct) => {
                // This should properly be a delete request, but the SDK generator,
                // does not support parameters in the delete request besides the foreign key,
                // making it a bit more difficult to include the access token :-).
                await CartProductEntity.destroy({ where: { uuid: cartProduct.uuid } });
                return { message: 'Product entity removed from cart' };
            }
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
            includes: ['ProductEntityState', 'Cart'],
            serviceOnly: true,
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
