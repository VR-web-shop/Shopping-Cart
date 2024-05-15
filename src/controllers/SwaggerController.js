import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import dir from 'path';
import express from 'express';

const __dirname = dir.resolve();
const router = express.Router()
let url = process.env.DEV_SERVER_URL
if (process.env.NODE_ENV === 'production') {
    url = process.env.PROD_SERVER_URL
}
const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Shopping Cart API',
            description: "API endpoints for the Shopping Cart.",
            contact: {
                name: "GitHub Repository",
                url: "https://github.com/VR-web-shop/Shopping-Cart"
            },
            version: '1.0.0',
        },
        servers: [
            {
                url,
                description: "Server"
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                }
            }
        }
    },
    apis: [`${__dirname}/src/controllers/api/v1/*.js`]
}

const swaggerDocument = swaggerJsdoc(options);
router.use('/api/v1/documentation', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

export default router;
