import _ReadCollectionQuery from "../abstractions/ReadCollectionQuery.js";
import ProductOrderDTO from "../../dtos/ProductOrder.js";

export default class ReadCollectionQuery extends _ReadCollectionQuery {
    constructor(options={}, snapshotOptions={}) {
        super(
            options, 
            ProductOrderDTO, 
            "ProductOrders", 
            "ProductOrderDescription", 
            "ProductOrderRemoved",
            snapshotOptions,
            "product_order_client_side_uuid",
            "client_side_uuid",
            true
        );
    }
}
