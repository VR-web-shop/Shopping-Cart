import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "product_client_side_uuid", 
            ["name", "description", "price", "thumbnail_source"],
            "Product",
            "ProductDescription",
            "ProductRemoved"
        );
    }
}
