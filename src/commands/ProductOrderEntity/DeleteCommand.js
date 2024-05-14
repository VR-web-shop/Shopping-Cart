import _DeleteCommand from "../abstractions/DeleteCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            "product_order_entity_client_side_uuid",
            "ProductOrderEntity",
            "ProductOrderEntityRemoved"
        );
    }
}
