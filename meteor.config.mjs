import 'dotenv/config'
import meteor from "@vr-web-shop/meteor";
import Controller from "./src/controllers/api/v1/Controller.js";

const { SERVER_HOST, SERVER_PORT } = process.env
meteor.BuildAPISDK(
    `./sdk/sdk.js`, 
    `http://${SERVER_HOST}:${SERVER_PORT}`, 
    Controller,
    { storage: 'localStorage', key: 'auth' }
)
