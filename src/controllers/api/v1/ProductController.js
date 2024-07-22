import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/Product/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/Product/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const queryService = new ModelQueryService()

router.route('/api/v1/products')
    /**
     * @openapi
     * '/api/v1/products':
     *  get:
     *     tags:
     *       - Product Controller
     *     summary: Get all products
     *     security:
     *      - bearerAuth: []
     *     responses:
     *      200:
     *        description: OK
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
                ...LinkService.paginateLinks(`api/v1/products`, parseInt(page), pages), 
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
