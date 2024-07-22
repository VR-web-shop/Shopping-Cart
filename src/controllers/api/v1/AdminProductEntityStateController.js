import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/ProductEntityState/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/ProductEntityState/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import LinkService from "../../../services/LinkService.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';

const router = express.Router()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/product_entity_states')
    /**
     * @openapi
     * '/api/v1/admin/product_entity_states':
     *  get:
     *     tags:
     *       - Admin Product Entity State Controller
     *     summary: Get all product entity states
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
                ...LinkService.paginateLinks(`api/v1/admin/product_entity_states`, parseInt(page), pages), 
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
