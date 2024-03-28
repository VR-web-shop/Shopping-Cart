import 'dotenv/config'
import './src/config/BrokerConfig.js'
import express from 'express';
import SwaggerController from './src/controllers/SwaggerController.js';
import Controller from './src/controllers/api/v1/Controller.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(SwaggerController);

Object.values(Controller).forEach(controller => {
    app.use(controller.router)
})

app.listen(process.env.SERVER_PORT, () => {
    console.log(`Server is running on port ${process.env.SERVER_PORT}`);
});
