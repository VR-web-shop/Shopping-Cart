
export default function ProductOrderEntityDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        product_entity_client_side_uuid: entity.product_entity_client_side_uuid,
        product_order_client_side_uuid: entity.product_order_client_side_uuid,
        transaction_state_name: entity.distributed_transaction_state_name,
        transaction_message: entity.transaction_message,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    }

    return attributes;
}
