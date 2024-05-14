import _PutCommand from "../abstractions/PutCommand.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "payment_option_client_side_uuid", 
            ["name", "price"],
            "PaymentOption",
            "PaymentOptionDescription",
            "PaymentOptionRemoved"
        );
    }
}
