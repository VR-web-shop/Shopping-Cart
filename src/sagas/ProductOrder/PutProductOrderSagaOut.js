import Sagas from "@vr-web-shop/sagas";
import ModelCommandService from "../../services/ModelCommandService.js";
import ProductOrderPutCommand from "../../commands/ProductOrder/PutCommand.js";
import ProductOrderEntityPutCommand from "../../commands/ProductOrderEntity/PutCommand.js";
import DistributedTransactionCreateCommand from "../../commands/DistributedTransaction/CreateCommand.js";
import db from "../../../db/models/index.cjs";

const cmdService = ModelCommandService();

const eventName = "Put_Shopping_Cart_Product_Order";
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
    const product_order = params.product_order;
    await db.sequelize.transaction(async (transaction) => {
        await cmdService.invoke(new DistributedTransactionCreateCommand(distributed_transaction_transaction_uuid, {
            distributed_transaction_state_name
        }), { transaction });

        await cmdService.invoke(new ProductOrderPutCommand(product_order.client_side_uuid, {
            product_order_state_name: product_order.product_order_state_name,
            name: product_order.name,
            email: product_order.email,
            address: product_order.address,
            city: product_order.city,
            country: product_order.country,
            postal_code: product_order.postal_code,
            deliver_option_client_side_uuid: product_order.deliver_option_client_side_uuid,
            payment_option_client_side_uuid: product_order.payment_option_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });
    });
};

handler.initiateEvent(async (
    distributed_transaction_transaction_uuid,
    distributed_transaction_state_name,
    params,
) => {
    console.log("Put_Shopping_Cart_Product_Order, initiateEvent: ", params);
    const product_order = params.product_order;
    const transaction = params.transaction;
    delete params.transaction;

    await cmdService.invoke(new DistributedTransactionCreateCommand(distributed_transaction_transaction_uuid, {
        distributed_transaction_state_name
    }), { transaction });

    await cmdService.invoke(new ProductOrderPutCommand(product_order.client_side_uuid, {
        product_order_state_name: product_order.product_order_state_name,
        name: product_order.name,
        email: product_order.email,
        address: product_order.address,
        city: product_order.city,
        country: product_order.country,
        postal_code: product_order.postal_code,
        deliver_option_client_side_uuid: product_order.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: product_order.payment_option_client_side_uuid,
        distributed_transaction_transaction_uuid
    }), { transaction });

    const product_order_entities = params.product_order_entities || [];
    for (const product_order_entity of product_order_entities) {
        await cmdService.invoke(new ProductOrderEntityPutCommand(product_order_entity.client_side_uuid, {
            product_order_client_side_uuid: product_order_entity.product_order_client_side_uuid,
            product_entity_client_side_uuid: product_order_entity.product_entity_client_side_uuid,
            distributed_transaction_transaction_uuid
        }), { transaction });
    }

    return {
        product_order, 
        product_order_entities
    };
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

export default handler.start;