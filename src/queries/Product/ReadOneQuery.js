import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductDTO from "../../dtos/Product.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductDTO, 
            "Products", 
            "ProductDescription", 
            "ProductRemoved",
            "product_client_side_uuid",
            additionalParams,
            true
        );
    }
}
