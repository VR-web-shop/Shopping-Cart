import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductEntityStateDTO from "../../dtos/ProductEntityState.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductEntityStateDTO, 
            "ProductEntityStates",
            null,
            null,
            snapshotOptions,
            null,
            "name",
        );
    }
}
