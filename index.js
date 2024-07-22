import 'dotenv/config'
import './src/sagas/SagaHandlerCtrl.js'
import Sagas from "@vr-web-shop/sagas";
import express from 'express';
import cors from 'cors';
import SwaggerController from './src/controllers/SwaggerController.js';
import AdminCartController from './src/controllers/api/v1/AdminCartController.js';
import AdminCartProductEntityController from './src/controllers/api/v1/AdminCartProductEntityController.js';
import AdminCartStateController from './src/controllers/api/v1/AdminCartStateController.js';
import AdminHealthController from './src/controllers/api/v1/AdminHealthController.js';
import AdminProductOrderController from './src/controllers/api/v1/AdminProductOrderController.js';
import AdminProductEntityStateController from './src/controllers/api/v1/AdminProductEntityStateController.js';
import AdminProductOrderStateController from './src/controllers/api/v1/AdminProductOrderStateController.js';
import AdminProductOrderEntityController from './src/controllers/api/v1/AdminProductOrderEntityController.js';
import CartController from './src/controllers/api/v1/CartController.js';
import CartProductEntityController from './src/controllers/api/v1/CartProductEntityController.js';
import CartStateController from './src/controllers/api/v1/CartStateController.js';
import DeliverOptionController from './src/controllers/api/v1/DeliverOptionController.js';
import PaymentOptionController from './src/controllers/api/v1/PaymentOptionController.js';
import ProductOrderController from './src/controllers/api/v1/ProductOrderController.js';
import ProductEntityController from './src/controllers/api/v1/ProductEntityController.js';
import ProductController from './src/controllers/api/v1/ProductController.js';
import rollbar from "./rollbar.js";

const port = process.env.SERVER_PORT;

(async () => {
    await Sagas.BrokerService.connect()

    const app = express();

    app.use(cors({ origin: '*' }));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(rollbar.errorHandler());
    
    app.use(SwaggerController);
    app.use(CartController);
    app.use(CartProductEntityController);
    app.use(CartStateController);
    app.use(DeliverOptionController);
    app.use(PaymentOptionController);
    app.use(ProductOrderController);
    app.use(ProductEntityController);
    app.use(ProductController);
    app.use(AdminCartController);
    app.use(AdminCartProductEntityController);
    app.use(AdminCartStateController);
    app.use(AdminHealthController);
    app.use(AdminProductOrderController);
    app.use(AdminProductEntityStateController);
    app.use(AdminProductOrderStateController);
    app.use(AdminProductOrderEntityController);
    
    app.listen(port, () => {
        console.log(`
            === Shopping Cart Service ===
            Server: Express
            Port: ${port}
            
            === Swagger Docs ===
            URL: http://localhost:${port}/api/v1/documentation

            === Message Broker ===
            URL: ${process.env.MESSAGE_BROKER_URL}
            Connected: ${Sagas.BrokerService.isConnected()}

            === Rollbar ===
            Enabled: ${rollbar.client.options.enabled}
        `);
    });
})();

