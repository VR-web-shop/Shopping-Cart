import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import DistributedTransactionDTO from "../../dtos/DistributedTransaction.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(transactionUUID, additionalParams = {}) {
        super(
            transactionUUID, 
            "transaction_uuid",
            DistributedTransactionDTO, 
            "DistributedTransactions", 
            null,
            null,
            null,
            additionalParams
        );
    }
}
