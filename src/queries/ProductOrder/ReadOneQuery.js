import _ReadOneQuery from "../abstractions/ReadOneQuery.js";
import ProductOrderDTO from "../../dtos/ProductOrder.js";

export default class ReadOneQuery extends _ReadOneQuery {
    constructor(clientSideUUID, additionalParams = {}) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            ProductOrderDTO, 
            "ProductOrders", 
            "ProductOrderDescription", 
            "ProductOrderRemoved",
            "product_order_client_side_uuid",
            additionalParams,
            true
        );
    }
}
