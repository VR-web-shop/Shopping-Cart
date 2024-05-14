import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/PaymentOption/PutCommand.js";
import db from "../../../db/models/index.cjs";

const cmdService = ModelCommandService();

const eventName = "Put_Products_Payment_Option";
const idempotentMessageHandler = new Sagas.IdempotentMessageHandler(
    eventName, 
    db
);

const handler = new Sagas.SagaHandler.handler({
    eventName,
    type: Sagas.SagaHandler.types.COMPLETE
}, Sagas.BrokerService);

handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    if (response.message_uuid && await idempotentMessageHandler.existOrCreate(response.message_uuid)) {
        console.log(`${eventName}, message_uuid already processed: `, response.message_uuid);
        return;
    }

    await cmdService.invoke(new PutCommand(response.params.client_side_uuid, {
        name: response.params.name,
        price: response.params.price,
    }));

    return response.params;
});

export default async (params) => {}