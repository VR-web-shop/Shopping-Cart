import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import ModelQueryService from "../../services/ModelQueryService.js";
import CartProductEntityCreateCommand from "../../commands/CartProductEntity/CreateCommand.js";
import CartProductEntityDeleteCommand from "../../commands/CartProductEntity/DeleteCommand.js";
import CartProductEntityReadOneQuery from "../../queries/CartProductEntity/ReadOneQuery.js";
import ProductEntityPutCommand from "../../commands/ProductEntity/PutCommand.js";
import ProductEntityReadOneQuery from "../../queries/ProductEntity/ReadOneQuery.js";
import db from "../../../db/models/index.cjs";

const cmdService = ModelCommandService();
const queryService = ModelQueryService();

const eventName = "Put_Shopping_Cart_Product_Entity";
const idempotentMessageHandler = new Sagas.IdempotentMessageHandler(
    eventName,
    db
);

const handler = new Sagas.SagaHandler.handler({
    eventName,
    type: Sagas.SagaHandler.types.START,
}, Sagas.BrokerService);

const update = async (
    message_uuid,
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    params,
) => {
    if (message_uuid && await idempotentMessageHandler.existOrCreate(message_uuid)) {
        console.log(`${eventName}, message_uuid already processed: `, message_uuid);
        return;
    }
    
    await cmdService.invoke(new ProductEntityPutCommand(params.client_side_uuid, {
        product_entity_state_name: params.product_entity_state_name,
        product_client_side_uuid: params.product_client_side_uuid,
        distributed_transaction_transaction_uuid
    }), {
        beforeTransactions: [
            async (transaction, entity, params, db) => {
                await db["DistributedTransaction"].create(
                    { 
                        transactionUUID: distributed_transaction_transaction_uuid,
                        distributed_transaction_state_name,
                        transaction_message: "Send message to Put Shopping Cart Product Entity"
                    },
                    { transaction }
                );
            }
        ]
    });

    return params;
};

handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    params,
) => {
    if (!params.product_entity_client_side_uuid) {
        const cartProductEntity = await queryService.invoke(new CartProductEntityReadOneQuery(params.client_side_uuid));
        params.product_entity_client_side_uuid = cartProductEntity.product_entity_client_side_uuid;
    }

    const productEntity = await queryService.invoke(new ProductEntityReadOneQuery(params.product_entity_client_side_uuid));

    if (params.operation === "create") {
        await cmdService.invoke(new CartProductEntityCreateCommand(params.client_side_uuid, {
            product_entity_client_side_uuid: params.product_entity_client_side_uuid,
            product_client_side_uuid: params.product_client_side_uuid,
            cart_client_side_uuid: params.cart_client_side_uuid,
        }));
    } else if (params.operation === "delete") {
        await cmdService.invoke(new CartProductEntityDeleteCommand(params.client_side_uuid));
    }

    return update(
        null,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name, 
        {
            client_side_uuid: params.product_entity_client_side_uuid,
            product_entity_state_name: params.product_entity_state_name,
            product_client_side_uuid: productEntity.product_client_side_uuid
        }
    );
});

handler.onCompleteEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {

    return update(
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name, 
        response.params
    );
});

handler.onReduceEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    response,
) => {
    return update(
        response.message_uuid,
        distributed_transaction_transaction_uuid, 
        distributed_transaction_state_name, 
        response.params
    );
});

export default async (operation, params) => {
    if (operation !== "create" && operation !== "delete") {
        throw new Error("Invalid operation: " + operation);
    }

    params.operation = operation;

    return await handler.start(params);
}
