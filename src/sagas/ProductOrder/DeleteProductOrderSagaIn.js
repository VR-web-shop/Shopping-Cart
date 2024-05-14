import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import DeleteCommand from "../../commands/ProductOrder/DeleteCommand.js";
import PutCommand from "../../commands/ProductOrder/PutCommand.js";
import DistributedTransactionCreateCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Delete_Products_Product_Order";
const type = Sagas.SagaHandler.types.COMPLETE;

const idempotentMessageHandler = new Sagas.IdempotentMessageHandler( eventName, db );
const handler = new Sagas.SagaHandler.handler({ eventName, type });
const cmdService = ModelCommandService();

handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    await db.sequelize.transaction(async (transaction) => {
        const { message_uuid, params } = response;
        if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid, transaction)) {
            console.log(`${eventName}, message_uuid already processed: `, message_uuid);
            return;
        }

        await cmdService.invoke(new DistributedTransactionCreateCommand(
            distributed_transaction_transaction_uuid, 
            { 
                distributed_transaction_state_name,
                transaction_message: JSON.stringify({
                    eventName, type, params, message_uuid
                }) 
            }
        ), { transaction });

        await cmdService.invoke(new PutCommand(params.client_side_uuid, {
            name: params.name,
            email: params.email,
            address: params.address,
            city: params.city,
            country: params.country,
            postal_code: params.postal_code,
            product_order_state_name: params.product_order_state_name,
            deliver_option_client_side_uuid: params.deliver_option_client_side_uuid,
            payment_option_client_side_uuid: params.payment_option_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });

        await cmdService.invoke(new DeleteCommand(
            response.params.client_side_uuid
        ), { transaction });
    });

    return response.params;
});

export default async (params) => {}