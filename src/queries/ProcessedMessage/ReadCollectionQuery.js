import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProcessedMessageDTO from "../../dtos/ProcessedMessage.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            ProcessedMessageDTO, 
            "ProcessedMessages", 
            null, 
            null, 
            null,
            null,
            "subscriber_id"
        );
    }
}
