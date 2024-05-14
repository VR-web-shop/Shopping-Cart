import _CreateCommand from "../abstractions/CreateCommand.js";

export default class CreateCommand extends _CreateCommand {
    constructor(subscriberID, params) {
        super(
            subscriberID, 
            params, 
            "subscriber_id",
            "ProcessedMessage",
        );
    }
}
