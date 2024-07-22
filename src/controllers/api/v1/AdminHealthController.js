import APIActorError from "../errors/APIActorError.js";
import ReadOneQuery from "../../../queries/Product/ReadOneQuery.js";
import ReadCollectionQuery from "../../../queries/Product/ReadCollectionQuery.js";
import ModelQueryService from "../../../services/ModelQueryService.js";
import LinkService from "../../../services/LinkService.js";
import Middleware from "../../../jwt/MiddlewareJWT.js";
import rollbar from "../../../../rollbar.js";
import express from 'express';
import Sagas from "@vr-web-shop/sagas";

const router = express.Router()
const queryService = new ModelQueryService()

router.use(Middleware.AuthorizeJWT)

router.route('/api/v1/admin/health')
    /**
     * @openapi
     * '/api/v1/admin/health':
     *  get:
     *     tags:
     *       - Admin Health Controller
     *     summary: Check the health of the application
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
     *              mysql_connected:
     *               type: boolean
     *              broker_connected:
     *               type: boolean
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
            let mysql_connected = false;
            try {
                await queryService.invoke(new ReadCollectionQuery({
                    limit: 10, page: 1
                }))
                mysql_connected = true;
            } catch (error) {
                console.log(error)
                mysql_connected = false;
            }

            let broker_connected = false;
            try {
                broker_connected = Sagas.BrokerService.isConnected();
            } catch (error) {
                console.log(error)
                broker_connected = false;
            }

            res.send({ 
                mysql_connected,
                broker_connected,
                api_version: 'v1',
                api_type: 'REST',
                exception_handler: 'rollbar',
                server: 'express',
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
