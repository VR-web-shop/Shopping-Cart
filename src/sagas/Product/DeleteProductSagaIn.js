import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import DeleteCommand from "../../commands/Product/DeleteCommand.js";
import db from "../../../db/models/index.cjs";

const cmdService = ModelCommandService();

const eventName = "Delete_Scenes_Product";
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
    /*
    await cmdService.invoke(new PutCommand(response.params.client_side_uuid, {
        product_entity_state_name: response.params.product_entity_state_name,
        product_client_side_uuid: response.params.product_client_side_uuid
    }));*/

    await cmdService.invoke(new DeleteCommand(
        response.params.client_side_uuid
    ));

    return response.params;
});

export default async (params) => {}