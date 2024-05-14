import _CreateCommand from "../abstractions/CreateCommand.js";

export default class CreateCommand extends _CreateCommand {
    constructor(transaction_uuid, params) {
        super(
            transaction_uuid, 
            params, 
            "transactionUUID",
            "DistributedTransaction",
        );
    }
}
