import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductOrderEntityDTO from "../../dtos/ProductOrderEntity.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductOrderEntityDTO, 
            "ProductOrderEntities", 
            "ProductOrderEntityDescription", 
            "ProductOrderEntityRemoved",
            snapshotOptions,
            "product_order_entity_client_side_uuid",
            "client_side_uuid",
            true
        );
    }
}
