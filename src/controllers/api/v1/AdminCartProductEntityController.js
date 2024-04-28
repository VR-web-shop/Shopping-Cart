import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/CartProductEntity/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/CartProductEntity/ReadCollectionQuery.js";
import CreateCommand from "../../../commands/CartProductEntity/CreateCommand.js";
import DeleteCommand from "../../../commands/CartProductEntity/DeleteCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/cart_product_entities/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/admin/cart_product_entities/{client_side_uuid}':
     *  get:
     *     tags:
     *       - Cart Product Entity Controller
     *     summary: Fetch a cart product entity by UUID
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
     *               cart_client_side_uuid:
     *                 type: string
     *               product_entity_client_side_uuid:
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
    .get(Middleware.AuthorizePermissionJWT("cart-product-entities:show"), async (req, res) => {
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

router.route('/api/v1/admin/cart_product_entities')
    /**
    * @openapi
    * '/api/v1/admin/cart_product_entities':
    *  get:
    *     tags:
    *       - Cart Product Entity Controller
    *     summary: Fetch all cart product entities
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
    *                 cart_client_side_uuid:
    *                  type: string
    *                 product_entity_client_side_uuid:
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
    .get(Middleware.AuthorizePermissionJWT("cart-product-entities:index"), async (req, res) => {
        try {
            console.log(req.query)
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ rows, count, pages })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })
    /**
    * @openapi
    * '/api/v1/admin/cart_product_entities':
    *  post:
    *     tags:
    *       - Cart Product Entity Controller
    *     summary: Create a new cart product entity
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
    *          - cart_client_side_uuid
    *          - product_entity_client_side_uuid
    *         properties:
    *          client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          cart_client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
    *          product_entity_client_side_uuid:
    *           type: string
    *           default: 123e4567-e89b-12d3-a456-426614174000
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
    *               cart_client_side_uuid:
    *                 type: string
    *               product_entity_client_side_uuid:
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
    .post(Middleware.AuthorizePermissionJWT("cart-product-entities:put"), async (req, res) => {
        try {
            const { client_side_uuid, cart_client_side_uuid, product_entity_client_side_uuid } = req.body
            await commandService.invoke(new CreateCommand(client_side_uuid, { cart_client_side_uuid, product_entity_client_side_uuid }))
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
    * '/api/v1/admin/cart_product_entities':
    *  delete:
    *     tags:
    *       - Cart Product Entity Controller
    *     summary: Delete a cart product entity
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
    .delete(Middleware.AuthorizePermissionJWT("cart-product-entities:delete"), async (req, res) => {
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
