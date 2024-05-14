import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/CartState/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/CartState/ReadCollectionQuery.js";
import CreateCommand from "../../../commands/CartState/CreateCommand.js";
import ModelCommandService from "../../../services/ModelCommandService.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const commandService = new ModelCommandService()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/cart_state/:name')
    /**
     * @openapi
     * '/api/v1/admin/cart_state/{name}':
     *  get:
     *     tags:
     *       - Cart State Controller
     *     summary: Fetch a cart state by name
     *     security:
     *      - bearerAuth: []
     *     parameters:
     *      - in: path
     *        name: name
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
     *               name:
     *                 type: string
     *               _links:
     *                 type: object
     *                 properties:
     *                  self:
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
    .get(Middleware.AuthorizePermissionJWT("cart-states:show"), async (req, res) => {
        try {
            const { name } = req.params
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/admin/cart_state/${name}`, "GET", [
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

router.route('/api/v1/admin/cart_states')
    /**
    * @openapi
    * '/api/v1/admin/cart_states':
    *  get:
    *     tags:
    *       - Cart State Controller
    *     summary: Fetch all cart states
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
    *                 name:
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
    .get(Middleware.AuthorizePermissionJWT("cart-states:index"), async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ 
                rows, 
                count, 
                pages,
                ...LinkService.paginateLinks(`api/v1/admin/cart_states`, parseInt(page), pages), 
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
    * '/api/v1/admin/cart_states':
    *  post:
    *     tags:
    *       - Cart State Controller
    *     summary: Create a new cart state
    *     security:
    *      - bearerAuth: []
    *     requestBody:
    *      required: true
    *      content:
    *       application/json:
    *        schema:
    *         type: object
    *         required:
    *          - name
    *         properties:
    *          name:
    *           type: string
    *     responses:
    *      200:
    *        description: OK
    *        content:
    *         application/json:
    *           schema:
    *             type: object
    *             properties:
    *               name:
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
    *      400:
    *        description: Bad Request
    *      404:
    *        description: Not Found
    *      401:
    *        description: Unauthorized
    *      500:
    *        description: Internal Server Error
    */
    .post(Middleware.AuthorizePermissionJWT("cart-states:put"), async (req, res) => {
        try {
            throw new APIActorError(410, 'Gone')

            const { name } = req.body
            await commandService.invoke(new CreateCommand(name))
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                ...response,
                ...LinkService.entityLinks(`api/v1/admin/cart_states`, "POST", [
                    { name: 'get', method: 'GET' },
                ], `api/v1/admin/cart_state/${name}`)
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
