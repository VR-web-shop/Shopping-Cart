import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/ProductOrderEntity/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/ProductOrderEntity/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/product_order_entities')
    /**
     * @openapi
     * '/api/v1/admin/product_order_entities':
     *  get:
     *     tags:
     *       - Admin Product Order Entity Controller
     *     summary: Get all product order entities
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
                ...LinkService.paginateLinks(`api/v1/admin/product_order_entities`, parseInt(page), pages), 
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
