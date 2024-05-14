import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import CartDTO from "../../dtos/Cart.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            CartDTO, 
            "Carts", 
            "CartDescription", 
            null,
            "cart_client_side_uuid",
            additionalParams
        );
    }
}
