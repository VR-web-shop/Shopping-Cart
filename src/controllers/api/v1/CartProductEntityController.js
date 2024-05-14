import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/CartProductEntity/ReadOneQuery.js";
import CartProductEntitySaga from "../../../sagas/CartProductEntity/CartProductEntitySagaOut.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import CartJWT from "../../../jwt/CartJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const queryService = new ModelQueryService()

router.route('/api/v1/cart_product_entities')
    /**
    * @openapi
    * '/api/v1/cart_product_entities':
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
    *          - product_entity_client_side_uuid
    *         properties:
    *          client_side_uuid:
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
    .post(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { sub: cart_client_side_uuid } = req.cart
            const { client_side_uuid, product_entity_client_side_uuid } = req.body
            const product_entity_state_name = 'RESERVERED_BY_CUSTOMER_CART'
            await CartProductEntitySaga("create", { client_side_uuid, cart_client_side_uuid, product_entity_state_name, product_entity_client_side_uuid })
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                response,
                ...LinkService.entityLinks(`api/v1/cart_product_entities`, "POST", [
                    { name: 'get', method: 'GET' },
                    { name: 'delete', method: 'DELETE' },
                ], `api/v1/cart_product_entity/${client_side_uuid}`)
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
router.route('/api/v1/cart_product_entity/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/cart_product_entity/{client_side_uuid}':
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
    .get(CartJWT.AuthorizeJWTCart, async (req, res) => {
        try {
            const { client_side_uuid } = req.params
            const response = await queryService.invoke(new ReadOneQuery(client_side_uuid))
            res.send({
                response,
                ...LinkService.entityLinks(`api/v1/cart_product_entity/${client_side_uuid}`, "GET", [
                    { name: 'delete', method: 'DELETE' },
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
    * '/api/v1/cart_product_entity/{client_side_uuid}':
    *  delete:
    *     tags:
    *       - Cart Product Entity Controller
    *     summary: Delete a cart product entity
    *     security:
    *      - bearerAuth: []
    *     parameters:
    *     - in: path
    *       name: client_side_uuid
    *       required: true
    *       schema:
    *        type: string
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
            const { sub: cart_client_side_uuid } = req.cart
            const { client_side_uuid } = req.params
            const product_entity_state_name = 'AVAILABLE_FOR_PURCHASE'
            await CartProductEntitySaga("delete", { client_side_uuid, cart_client_side_uuid, product_entity_state_name })
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
