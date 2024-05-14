import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductEntityDTO from "../../dtos/ProductEntity.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductEntityDTO, 
            "productEntities", 
            "ProductEntityDescription", 
            "ProductEntityRemoved",
            snapshotOptions,
            "product_entity_client_side_uuid",
            "client_side_uuid",
            true
        );
    }
}
