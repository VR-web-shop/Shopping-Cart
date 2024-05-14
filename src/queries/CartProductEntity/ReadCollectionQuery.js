import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import CartProductEntityDTO from "../../dtos/CartProductEntity.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            CartProductEntityDTO, 
            "CartProductEntities", 
            null, 
            "CartProductEntityRemoved",
            snapshotOptions,
            "cart_product_entity_client_side_uuid",
            "client_side_uuid"
        );
    }
}
