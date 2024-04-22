import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import PaymentOptionDTO from "../../dtos/PaymentOption.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            PaymentOptionDTO, 
            "PaymentOptions", 
            "PaymentOptionDescription", 
            "PaymentOptionRemoved",
            "payment_option_client_side_uuid",
            additionalParams
        );
    }
}
