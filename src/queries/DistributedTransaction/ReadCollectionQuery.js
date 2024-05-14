import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import DistributedTransactionDTO from "../../dtos/DistributedTransaction.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}) {
        super(
            options, 
            DistributedTransactionDTO, 
            "DistributedTransactions", 
            null, 
            null, 
            null,
            null,
            "transaction_uuid"
        );
    }
}
