import APIActorError from "../errors/APIActorError.js";
import CartReadOneQuery from "../../../queries/Cart/ReadOneQuery.js";
import ReadOneQuery from "../../../queries/ProductOrder/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/ProductOrder/ReadCollectionQuery.js";
import PutCommand from "../../../commands/ProductOrder/PutCommand.js";
import CartPutCommand from "../../../commands/Cart/PutCommand.js";
import DeleteCommand from "../../../commands/ProductOrder/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import PutProductOrderSagaOut from "../../../sagas/ProductOrder/PutProductOrderSagaOut.js";
import PDreadCollectionQuery from "../../../queries/CartProductEntity/ReadCollectionQuery.js";
import PDDeleteCommand from "../../../commands/CartProductEntity/DeleteCommand.js";
import CartJWT from "../../../jwt/CartJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';
import { Op } from "sequelize";
import { v4 } from 'uuid';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.route('/api/v1/product_orders')
    /**
    * @openapi
    * '/api/v1/product_orders':
    *  get:
    *     tags:
    *       - Product Order Controller
    *     summary: Fetch all product orders
    *     security:
    *      - bearerAuth: []
    *     parameters:
    *     - in: query
    *       name: page
    *       schema:
    *        type: integer
    *       description: The page number
    *     - in: query
    *       name: limit
    *       schema:
    *        type: integer
    *       description: The number of items per page
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *              pages:
    *               type: integer
    *              count:
    *               type: integer
    *              rows:
    *               type: array
    *               items:
    *                type: object
    *                properties:
    *                 client_side_uuid:
    *                  type: string
    *                 name:
    *                  type: string
    *                 email:
    *                  type: string
    *                 address:
    *                  type: string
    *                 city:
    *                  type: string
    *                 country:
    *                  type: string
    *                 postal_code:
    *                  type: string
    *                 product_order_state_name:
    *                  type: string
    *                 deliver_option_client_side_uuid:
    *                  type: string
    *                 payment_option_client_side_uuid:
    *                  type: string
    *              _links:
    *               type: object
    *               properties:
    *                self:
    *                 type: object
    *                 properties:
    *                  href:
    *                   type: string
    *                  method:
    *                   type: string
    *                next:
    *                 type: object
    *                 properties:
    *                  href:
    *                   type: string
    *                  method:
    *                   type: string
    *                previous:
    *                 type: object
    *                 properties:
    *                  href:
    *                   type: string
    *                  method:
    *                   type: string
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
            const { sub } = req.cart
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({
                limit, 
                page,
                where: [{
                    table: 'cart',
                    column: 'client_side_uuid',
                    operator: Op.eq,
                    key: 'cartClientSideUuid',
                    value: sub,
                }]
            }))
            res.send({ 
                rows, 
                count, 
                pages,
                ...LinkService.paginateLinks(`api/v1/product_orders`, parseInt(page), pages), 
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
    * '/api/v1/product_orders':
    *  post:
    *     tags:
    *       - Product Order Controller
    *     summary: Create a new product order
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
    *          - name
    *          - email
    *          - address
    *          - city
    *          - country
    *          - postal_code
    *          - deliver_option_client_side_uuid
    *          - payment_option_client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          name:
    *           type: string
    *           default: John Doe
    *          email:
    *           type: string
    *           default: test@test.dk
    *          address:
    *           type: string
    *           default: Test Address
    *          city:
    *           type: string
    *           default: Test City
    *          country:
    *           type: string
    *           default: Test Country
    *          postal_code:
    *           type: string
    *           default: 1234
    *          deliver_option_client_side_uuid:
    *           type: string
    *          payment_option_client_side_uuid:
    *           type: string
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
    *               name:
    *                type: string
    *               email:
    *                type: string
    *               address:
    *                type: string
    *               city:
    *                type: string
    *               country:
    *                type: string
    *               postal_code:
    *                type: string
    *               product_order_state_name:
    *                type: string
    *               deliver_option_client_side_uuid:
    *                type: string
    *               payment_option_client_side_uuid:
    *                type: string
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .post(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const product_order_state_name = 'WAITING_FOR_PAYMENT'
            const { client_side_uuid, name, email, address, city, country, postal_code, deliver_option_client_side_uuid, payment_option_client_side_uuid, cart_client_side_uuid } = req.body
            const { rows: productEntitiesRaw } = await queryService.invoke(new PDreadCollectionQuery({
                where: [{ 
                    table: 'CartProductEntities',
                    column: 'cart_client_side_uuid',
                    key: 'cart_client_side_uuid',
                    operator: Op.eq,
                    value: cart_client_side_uuid,
                 }],
            }));
            const product_order_entities = productEntitiesRaw.map(row => ({
                client_side_uuid: v4(),
                product_order_client_side_uuid: client_side_uuid,
                product_entity_client_side_uuid: row.product_entity_client_side_uuid,
            }));
            
            await PutProductOrderSagaOut({
                product_order: {
                    client_side_uuid,
                    product_order_state_name,
                    name,
                    email,
                    address,
                    city,
                    country,
                    postal_code,
                    deliver_option_client_side_uuid,
                    payment_option_client_side_uuid,
                },
                product_order_entities
            })
            await commandService.invoke(new CartPutCommand(cart_client_side_uuid, { 
                cart_state_name: 'WAITING_FOR_CHECKOUT', 
                product_order_client_side_uuid: client_side_uuid 
            }))

            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/product_orders`, "POST", [
                    { name: 'get', method: 'GET' },
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE' }
                ], `api/v1/product_order`)
            })
        } catch (error) {
            console.log(error)
            if (error instanceof APIActorError) {
                rollbar.info('APIActorError', { code: error.statusCode, message: error.message })
                return res.status(error.statusCode).send({ message: error.message })
            }

            rollbar.error(error)
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
router.route('/api/v1/product_order')
    /**
     * @openapi
     * '/api/v1/product_order':
     *  get:
     *     tags:
     *       - Product Order Controller
     *     summary: Fetch a product order by UUID
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
     *               name:
     *                 type: string
     *               email:
     *                 type: string
     *               address:
     *                 type: string
     *               city:
     *                 type: string
     *               country:
     *                 type: string
     *               postal_code: 
     *                 type: string
     *               product_order_state_name:
     *                 type: string
     *               deliver_option_client_side_uuid: 
     *                 type: string
     *               payment_option_client_side_uuid:
     *                 type: string
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
                ...product_order,
                ...LinkService.entityLinks(`api/v1/product_order`, "GET", [
                    { name: 'update', method: 'PATCH' },
                    { name: 'delete', method: 'DELETE' }
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
    * '/api/v1/product_order':
    *  patch:
    *     tags:
    *       - Product Order Controller
    *     summary: Update a product order
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
    *          - name
    *          - email
    *          - address
    *          - city
    *          - country
    *          - postal_code
    *          - deliver_option_client_side_uuid
    *          - payment_option_client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          name:
    *           type: string
    *           default: John Doe
    *          email:
    *           type: string
    *           default: test@test.dk
    *          address:
    *           type: string
    *           default: Test Address
    *          city:
    *           type: string
    *           default: Test City
    *          country:
    *           type: string
    *           default: Test Country
    *          postal_code:
    *           type: string
    *           default: 1234
    *          deliver_option_client_side_uuid:
    *           type: string
    *          payment_option_client_side_uuid:
    *           type: string
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
    *               name:
    *                type: string
    *               email:
    *                type: string
    *               address:
    *                type: string
    *               city:
    *                type: string
    *               country:
    *                type: string
    *               postal_code:
    *                type: string
    *               product_order_state_name:
    *                type: string
    *               deliver_option_client_side_uuid:
    *                type: string
    *               payment_option_client_side_uuid:
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
    *                 delete:
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
    .patch(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            console.log(req.body)
            const { sub: cart_client_side_uuid } = req.cart

            const cart = await queryService.invoke(new CartReadOneQuery(cart_client_side_uuid))
            if (!cart.product_order_client_side_uuid) {
                res.send({ msg: 'The cart has not product order yet!' })
                return
            }
            const client_side_uuid = cart.product_order_client_side_uuid
            const { rows: productEntitiesRaw } = await queryService.invoke(new PDreadCollectionQuery({
                where: [{ 
                    table: 'CartProductEntities',
                    column: 'cart_client_side_uuid',
                    key: 'cart_client_side_uuid',
                    operator: Op.eq,
                    value: cart_client_side_uuid,
                 }],
            }));
            const product_order_entities = productEntitiesRaw.map(row => ({
                client_side_uuid: v4(),
                product_order_client_side_uuid: client_side_uuid,
                product_entity_client_side_uuid: row.product_entity_client_side_uuid,
            }));

            
            const { name, email, address, city, country, postal_code, product_order_state_name, deliver_option_client_side_uuid, payment_option_client_side_uuid } = req.body
            await PutProductOrderSagaOut({
                product_order: {
                    client_side_uuid,
                    product_order_state_name,
                    name,
                    email,
                    address,
                    city,
                    country,
                    postal_code,
                    deliver_option_client_side_uuid,
                    payment_option_client_side_uuid,
                },
                product_order_entities
            })
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            if (response.product_order_state_name === 'WAITING_FOR_SHIPMENT') {
                await commandService.invoke(new CartPutCommand(cart_client_side_uuid, { 
                    cart_state_name: 'OPEN_FOR_PRODUCT_ENTITIES', 
                    product_order_client_side_uuid: null 
                }))
                productEntitiesRaw.forEach(async row => {
                    await commandService.invoke(new PDDeleteCommand(row.client_side_uuid))
                })
            }
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/product_order`, "GET", [
                    { name: 'get', method: 'GET' },
                    { name: 'delete', method: 'DELETE' }
                ])
            })
        } catch (error) {
            console.log(error)
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
    * '/api/v1/product_order':
    *  delete:
    *     tags:
    *       - Product Order Controller
    *     summary: Delete a product order
    *     security:
    *      - bearerAuth: []
    *     responses:
    *      204:
    *        description: No Content
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .delete(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub } = req.cart
            const cart = await queryService.invoke(new ReadOneQuery(sub))
            if (!cart.product_order_client_side_uuid) {
                res.send({ msg: 'The cart has not product order yet!' })
                return
            }
            const client_side_uuid = cart.product_order_client_side_uuid
            await commandService.invoke(new DeleteCommand(client_side_uuid))
            res.sendStatus(204)
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
