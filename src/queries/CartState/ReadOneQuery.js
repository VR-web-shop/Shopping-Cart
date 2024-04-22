import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import CartStateDTO from "../../dtos/CartState.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(name, additionalParams = {}) {
        super(
            name, 
            "name",
            CartStateDTO, 
            "CartStates",
            null,
            null,
            null,
            additionalParams,
        );
    }
}
