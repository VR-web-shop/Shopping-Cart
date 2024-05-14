
export default function ProductOrderDTO(entity) {
    if (!entity || typeof entity !== "object") {
        throw new Error("entity is required and must be an object");
    }

    const attributes = {
        client_side_uuid: entity.client_side_uuid,
        name: entity.name,
        email: entity.email,
        address: entity.address,
        city: entity.city,
        country: entity.country,
        postal_code: entity.postal_code,
        product_order_state_name: entity.product_order_state_name,
        deliver_option_client_side_uuid: entity.deliver_option_client_side_uuid,
        payment_option_client_side_uuid: entity.payment_option_client_side_uuid,
        transaction_state_name: entity.distributed_transaction_state_name,
        transaction_message: entity.transaction_message,
        created_at: entity.created_at,
        updated_at: entity.updated_at,
    }

    return attributes;
}
