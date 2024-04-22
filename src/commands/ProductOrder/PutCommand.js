import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "product_order_client_side_uuid", 
            [
                "name", 
                "email",
                "address",
                "city",
                "country",
                "postal_code",
                "product_order_state_name",
                "deliver_option_client_side_uuid",
                "payment_option_client_side_uuid"
            ],
            "ProductOrder",
            "ProductOrderDescription",
            "ProductOrderRemoved"
        );
    }
}
