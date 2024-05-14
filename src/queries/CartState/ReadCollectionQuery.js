import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import CartStateDTO from "../../dtos/CartState.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            CartStateDTO, 
            "CartStates",
            null,
            null,
            snapshotOptions,
            null,
            "name",
        );
    }
}
