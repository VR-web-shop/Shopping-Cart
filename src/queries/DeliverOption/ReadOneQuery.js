import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import DeliverOptionDTO from "../../dtos/DeliverOption.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            DeliverOptionDTO, 
            "DeliverOptions", 
            "DeliverOptionDescription", 
            "DeliverOptionRemoved",
            "deliver_option_client_side_uuid",
            additionalParams
        );
    }
}
