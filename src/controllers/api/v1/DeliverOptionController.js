import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/DeliverOption/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/DeliverOption/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const queryService = new ModelQueryService()

router.route('/api/v1/deliver_option/:client_side_uuid')
    /**
     * @openapi
     * '/api/v1/deliver_option/{client_side_uuid}':
     *  get:
     *     tags:
     *       - Deliver Option Controller
     *     summary: Fetch a deliver option by UUID
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
     *                type: string
     *               name:
     *                type: string
     *               price:
     *                type: number
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
            const { name } = req.params
            const response = await queryService.invoke(new ReadOneQuery(name))
            res.send({
                response,
                ...LinkService.entityLinks(`api/v1/deliver_option/${name}`, "GET", [
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
router.route('/api/v1/deliver_options')
    /**
    * @openapi
    * '/api/v1/deliver_options':
    *  get:
    *     tags:
    *       - Deliver Option Controller
    *     summary: Fetch all deliver options
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
    *                 price:  
    *                  type: number  
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
    .get(async (req, res) => {
        try {
            const { limit, page } = req.query
            const { rows, count, pages } = await queryService.invoke(new ReadCollectionQuery({limit, page}))
            res.send({ 
                rows, 
                count, 
                pages,
                ...LinkService.paginateLinks(`api/v1/deliver_options`, parseInt(page), pages), 
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
