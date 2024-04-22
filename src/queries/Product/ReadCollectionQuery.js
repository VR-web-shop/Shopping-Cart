import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductDTO from "../../dtos/Product.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductDTO, 
            "products", 
            "ProductDescription", 
            "ProductRemoved",
            snapshotOptions,
            "product_client_side_uuid",
            "client_side_uuid"
        );
    }
}
