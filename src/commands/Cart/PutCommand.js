import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID,
            params,
            "client_side_uuid",
            "cart_client_side_uuid",
            ["cart_state_name", "product_order_client_side_uuid"],
            "Cart",
            "CartDescription",
            null
        );
    }
}
