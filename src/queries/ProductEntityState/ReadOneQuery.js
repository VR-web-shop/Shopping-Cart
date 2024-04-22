import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductEntityStateDTO from "../../dtos/ProductEntityState.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(name, additionalParams = {}) {
        super(
            name, 
            "name",
            ProductEntityStateDTO, 
            "ProductEntityStates",
            null,
            null,
            null,
            additionalParams,
        );
    }
}
