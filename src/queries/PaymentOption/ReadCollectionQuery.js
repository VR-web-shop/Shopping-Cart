import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import PaymentOptionDTO from "../../dtos/PaymentOption.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            PaymentOptionDTO, 
            "PaymentOptions", 
            "PaymentOptionDescription", 
            "PaymentOptionRemoved",
            snapshotOptions,
            "payment_option_client_side_uuid",
            "client_side_uuid",
            true
        );
    }
}
