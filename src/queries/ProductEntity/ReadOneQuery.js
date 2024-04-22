import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductEntityDTO from "../../dtos/ProductEntity.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductEntityDTO, 
            "ProductEntities", 
            "ProductEntityDescription", 
            "ProductEntityRemoved",
            "product_entity_client_side_uuid",
            additionalParams
        );
    }
}
