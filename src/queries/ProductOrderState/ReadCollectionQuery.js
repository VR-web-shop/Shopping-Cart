import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductOrderStateDTO from "../../dtos/ProductOrderState.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductOrderStateDTO, 
            "ProductOrderStates",
            null,
            null,
            snapshotOptions,
            null,
            "name",
        );
    }
}
