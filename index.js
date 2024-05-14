import 'dotenv/config'
import './src/sagas/SagaHandlerCtrl.js'
import Sagas from "@vr-web-shop/sagas";
import express from 'express';
import cors from 'cors';
import SwaggerController from './src/controllers/SwaggerController.js';
import AdminCartController from './src/controllers/api/v1/AdminCartController.js';
import AdminCartProductEntityController from './src/controllers/api/v1/AdminCartProductEntityController.js';
import AdminCartStateController from './src/controllers/api/v1/AdminCartStateController.js';
import CartController from './src/controllers/api/v1/CartController.js';
import CartProductEntityController from './src/controllers/api/v1/CartProductEntityController.js';
import CartStateController from './src/controllers/api/v1/CartStateController.js';
import DeliverOptionController from './src/controllers/api/v1/DeliverOptionController.js';
import PaymentOptionController from './src/controllers/api/v1/PaymentOptionController.js';
import ProductOrderController from './src/controllers/api/v1/ProductOrderController.js';
import rollbar from "./rollbar.js";

(async () => {
    await Sagas.BrokerService.connect()

    const app = express();

    app.use(cors({origin: '*'}))
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
    app.use(AdminCartController);
    app.use(AdminCartProductEntityController);
    app.use(AdminCartStateController);
    
    app.listen(process.env.SERVER_PORT, () => {
        console.log(`Server is running on port ${process.env.SERVER_PORT}`);
    });
})();

