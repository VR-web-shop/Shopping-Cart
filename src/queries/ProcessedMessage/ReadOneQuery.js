import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProcessedMessageDTO from "../../dtos/ProcessedMessage.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(subscriberID, additionalParams = {}) {
        super(
            subscriberID, 
            "subscriber_id",
            ProcessedMessageDTO, 
            "ProcessedMessages", 
            null,
            null,
            null,
            additionalParams
        );
    }
}
