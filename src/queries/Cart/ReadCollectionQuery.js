import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import CartDTO from "../../dtos/Cart.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            CartDTO, 
            "Carts", 
            "CartDescription", 
            null,
            snapshotOptions,
            "cart_client_side_uuid",
            "client_side_uuid"
        );
    }
}
