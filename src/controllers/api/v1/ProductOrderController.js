import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/ProductOrder/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/ProductOrder/ReadCollectionQuery.js";
import PutCommand from "../../../commands/ProductOrder/PutCommand.js";
import DeleteCommand from "../../../commands/ProductOrder/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import CartJWT from "../../../jwt/CartJWT.js";
import express from 'express';
import { Op } from "sequelize";

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(CartJWT.AuthorizeJWTCart)

router.route('/api/v1/product_order/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/product_order/{client_side_uuid}':
     *  get:
     *     tags:
     *       - Product Order Controller
     *     summary: Fetch a product order by UUID
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: client_side_uuid
     *        required: true
     *        schema:
     *         type: string
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
     *      400:
     *        description: Bad Request
     *      404:
     *        description: Not Found
     *      401:
     *        description: Unauthorized
     *      500:
     *        description: Internal Server Error
     */
    .get(async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

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
    *              users:
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
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .get(async (req, res) => {
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
            res.send({ rows, count, pages })
        } catch (error) {
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
    .post(async (req, res) => {
        try {
            const product_order_state_name = 'WAITING_FOR_PAYMENT'
            const { client_side_uuid, name, email, address, city, country, postal_code, deliver_option_client_side_uuid, payment_option_client_side_uuid } = req.body
            await commandService.invoke(new CreateCommand(client_side_uuid, { name, email, address, city, country, postal_code, product_order_state_name, deliver_option_client_side_uuid, payment_option_client_side_uuid }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/product_orders':
    *  put:
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
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .put(async (req, res) => {
        try {
            const entity = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            const product_order_state_name = entity.product_order_state_name
            const { client_side_uuid, name, email, address, city, country, postal_code, deliver_option_client_side_uuid, payment_option_client_side_uuid } = req.body
            await commandService.invoke(new PutCommand(client_side_uuid, { name, email, address, city, country, postal_code, deliver_option_client_side_uuid, payment_option_client_side_uuid, product_order_state_name }))
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/product_orders':
    *  delete:
    *     tags:
    *       - Product Order Controller
    *     summary: Delete a product order
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
    *         properties:
    *          client_side_uuid:
    *           type: string
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
    .delete(async (req, res) => {
        try {
            const { client_side_uuid } = req.body
            await commandService.invoke(new DeleteCommand(client_side_uuid))
            res.sendStatus(204)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;