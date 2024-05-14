import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/Cart/ReadOneQuery.js";
import ReadOneQueryProductOrder from "../../../queries/ProductOrder/ReadOneQuery.js";
import ReadCollectionQueryCartProductEntity from "../../../queries/CartProductEntity/ReadCollectionQuery.js";
import PutCommand from "../../../commands/Cart/PutCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import CartJWT from "../../../jwt/CartJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';
import { Op } from "sequelize";

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.route('/api/v1/carts')
    /**
    * @openapi
    * '/api/v1/carts':
    *  post:
    *     tags:
    *       - Cart Controller
    *     summary: Create a new cart
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - client_side_uuid
    *          - cart_state_name
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          cart_state_name:
    *           type: string
    *           default: OPEN_FOR_PRODUCT_ENTITIES
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               cart:
    *                type: object
    *                properties:
    *                 client_side_uuid:
    *                  type: string
    *                 cart_state_name:
    *                  type: string
    *               access_token:
    *                type: string
    *               _links:
    *                type: object
    *                properties:
    *                 self:
    *                  type: object
    *                  properties:
    *                   href:
    *                    type: string
    *                   method:
    *                    type: string
    *                 get:
    *                  type: object
    *                  properties:
    *                   href:
    *                    type: string
    *                   method:
    *                    type: string
    *                 get cart and cart product entities:
    *                  type: object
    *                  properties:
    *                   href:
    *                    type: string
    *                   method:
    *                    type: string
    *                 get cart and cart product order:
    *                  type: object
    *                  properties:
    *                   href:
    *                    type: string
    *                   method:
    *                    type: string
    *                 update:
    *                  type: object
    *                  properties:
    *                   href:
    *                    type: string
    *                   method:
    *                    type: string
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .post(async (req, res) => {
        try {
            const { client_side_uuid, cart_state_name } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { cart_state_name }))
            const cart = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            const access_token = CartJWT.NewCartAuthentication(client_side_uuid)
            res.send({
                cart,
                access_token,
                ...LinkService.entityLinks(`api/v1/carts`, "POST", [
                    { name: 'get', method: 'GET' },
                    { name: 'get cart and cart product entities', method: 'GET', additionalPath: 'cart_product_entities' },
                    { name: 'get cart and cart product order', method: 'GET', additionalPath: 'product_order' },
                    { name: 'update', method: 'PATCH' },
                ], `api/v1/cart`)
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

router.route('/api/v1/cart/cart_product_entities')
    /**
     * @openapi
     * '/api/v1/cart/cart_product_entities':
     *  get:
     *     tags:
     *       - Cart Controller
     *     summary: Fetch a cart and its product entities
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               cart:
     *                type: object
     *                properties:
     *                 client_side_uuid:
     *                  type: string
     *                 cart_state_name:
     *                  type: string
     *               cart_product_entities:
     *                type: array
     *                items:
     *                 type: object
     *                 properties:
     *                  client_side_uuid:
     *                   type: string
     *                  cart_client_side_uuid:
     *                   type: string
     *                  product_entity_client_side_uuid:
     *                   type: string
     *               _links:
     *                type: object
     *                properties:
     *                  self:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  get:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  get cart and cart product order:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *                  update:
     *                   type: object
     *                   properties:
     *                    href:
     *                     type: string
     *                    method:
     *                     type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub: client_side_uuid } = req.cart
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            const { rows: cart_product_entities } = await queryService.invoke(new ReadCollectionQueryCartProductEntity({
                where: [
                    {
                        table: "CartProductEntities",
                        column: "cart_client_side_uuid",
                        key: "cart_client_side_uuid",
                        operator: Op.eq,
                        value: client_side_uuid
                    }
                ]
            }))
            res.send({
                cart: response,
                cart_product_entities,
                ...LinkService.entityLinks(`api/v1/cart/cart_product_entities`, "GET", [
                    { name: 'get', method: 'GET' },
                    { name: 'get cart and cart product order', method: 'GET', additionalPath: 'product_order' },
                    { name: 'update', method: 'PATCH' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/cart/product_order')
    /**
     * @openapi
     * '/api/v1/cart/product_order':
     *  get:
     *     tags:
     *       - Cart Controller
     *     summary: Fetch a cart and its product order
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               cart:
     *                type: object
     *                properties:
     *                 client_side_uuid:
     *                  type: string
     *                 cart_state_name:
     *                  type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub: client_side_uuid } = req.cart
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            if (!response.product_order_client_side_uuid) {
                res.send({ cart: response, msg: 'The cart has not product order yet!' })
                return
            }
            const product_order = await queryService.invoke(new ReadOneQueryProductOrder(response.product_order_client_side_uuid))
            res.send({
                cart: response,
                product_order,
                ...LinkService.entityLinks(`api/v1/cart/product_order`, "GET", [
                    { name: 'get', method: 'GET' },
                    { name: 'get cart and cart product entities', method: 'GET', additionalPath: 'cart_product_entities' },
                    { name: 'update', method: 'PATCH' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/cart')
    /**
     * @openapi
     * '/api/v1/cart':
     *  get:
     *     tags:
     *       - Cart Controller
     *     summary: Fetch a cart
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: OK
     *        content:
     *         application/json:
     *           schema:
     *             type: object
     *             properties:
     *               client_side_uuid:
     *                 type: string
     *               cart_state_name:
     *                 type: string
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub: client_side_uuid } = req.cart
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/cart`, "GET", [
                    { name: 'get cart and cart product entities', method: 'GET', additionalPath: 'cart_product_entities' },
                    { name: 'get cart and cart product order', method: 'GET', additionalPath: 'product_order' },
                    { name: 'update', method: 'PATCH' }
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/cart':
    *  patch:
    *     tags:
    *       - Cart Controller
    *     summary: Update a cart
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - cart_state_name
    *         properties:
    *          cart_state_name:
    *           type: string
    *           default: WAITING_FOR_CHECKOUT
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               client_side_uuid:
    *                 type: string 
    *               cart_state_name:
    *                 type: string
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .patch(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub: client_side_uuid } = req.cart
            const { cart_state_name, product_order } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { cart_state_name }, product_order))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/cart`, "PATCH", [
                    { name: 'get', method: 'GET' },
                    { name: 'get cart and cart product entities', method: 'GET', additionalPath: 'cart_product_entities' },
                    { name: 'get cart and cart product order', method: 'GET', additionalPath: 'product_order' },
                ])
            })
        } catch (error) {
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
