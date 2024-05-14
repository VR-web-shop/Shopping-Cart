import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import db from "../../../db/models/index.cjs";

const cmdService = ModelCommandService();

const eventName = "Put_Products_Product_Order";
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
        email: response.params.email,
        address: response.params.address,
        city: response.params.city,
        country: response.params.country,
        postal_code: response.params.postal_code,
        product_order_state_name: response.params.product_order_state_name,
        deliver_option_client_side_uuid: response.params.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: response.params.payment_option_client_side_uuid,
    }));

    return response.params;
});

export default async (params) => {}