import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import PutCommand from "../../commands/DeliverOption/PutCommand.js";
import DistributedTransactionCreateCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const eventName = "Put_Products_Deliver_Option";
const type = Sagas.SagaHandler.types.COMPLETE;

const idempotentMessageHandler = new Sagas.IdempotentMessageHandler(eventName, db);
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
                transaction_message: JSON.stringify(response) 
            }
        ), { transaction });

        await cmdService.invoke(new PutCommand(params.client_side_uuid, {
            name: params.name,
            price: params.price,
            distributed_transaction_transaction_uuid,
        }), { transaction });
    });

    return response.params;
});

export default async (params) => {}