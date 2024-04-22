import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "cart_product_entity_client_side_uuid", 
            ["cart_client_side_uuid", "product_entity_client_side_uuid"],
            "CartProductEntity",
            "CartProductEntityDescription",
            "CartProductEntityRemoved"
        );
    }
}
