import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import CartProductEntityDTO from "../../dtos/CartProductEntity.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            CartProductEntityDTO, 
            "CartProductEntities", 
            null, 
            "CartProductEntityRemoved",
            "cart_product_entity_client_side_uuid",
            additionalParams
        );
    }
}
