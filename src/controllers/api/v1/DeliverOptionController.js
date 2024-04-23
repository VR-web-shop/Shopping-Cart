import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/DeliverOption/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/DeliverOption/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
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
            res.send(response)
        } catch (error) {
            if (error instanceof APIActorError) {
                return res.status(error.statusCode).send({ message: error.message })
            }

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
    *              users:
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
            res.send({ rows, count, pages })
        } catch (error) {
            console.error(error)
            return res.status(500).send({ message: 'Internal Server Error' })
        }
    })

export default router;
