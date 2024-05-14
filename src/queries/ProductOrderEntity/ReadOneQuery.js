import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductOrderEntityDTO from "../../dtos/ProductOrderEntity.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductOrderEntityDTO, 
            "ProductOrderEntities", 
            "ProductOrderEntityDescription", 
            "ProductOrderEntityRemoved",
            "product_order_entity_client_side_uuid",
            additionalParams,
            true
        );
    }
}
