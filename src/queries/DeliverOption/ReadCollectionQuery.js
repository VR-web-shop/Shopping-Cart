import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import DeliverOptionDTO from "../../dtos/DeliverOption.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            DeliverOptionDTO, 
            "DeliverOptions", 
            "DeliverOptionDescription", 
            "DeliverOptionRemoved",
            snapshotOptions,
            "deliver_option_client_side_uuid",
            "client_side_uuid"
        );
    }
}
