import _PutCommand from "../abstractions/PutCommand.js";
import PutProductEntityCommand from "../ProductEntity/PutCommand.js";
import PutCartCommand from "../cart/PutCommand.js";
import DeleteCartEntityCommand from "../CartProductEntity/DeleteCommand.js";
import ReadCollectionCartEntitiesQuery from "../../queries/Cart/ReadCollectionQuery.js";

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "product_order_client_side_uuid", 
            [
                "name", 
                "email",
                "address",
                "city",
                "country",
                "postal_code",
                "product_order_state_name",
                "deliver_option_client_side_uuid",
                "payment_option_client_side_uuid",
                "distributed_transaction_transaction_uuid"
            ],
            "ProductOrder",
            "ProductOrderDescription",
            "ProductOrderRemoved"
        );
    }

    async execute(db) {
        await super.execute(db, {
            afterTransactions: [
                async (t, entity, snapshot) => {
                    /**
                     * The current implementation of the shopping cart does only support mock purchases.
                     * This means that if a proder order's state is moved to 'WAITING_FOR_PAYMENT', this
                     * is considered a successful purchase. In a real-world scenario, this would have
                     * to go through a payment gateway and the state would be updated based on the payment
                     * gateway's response.
                     */
                    if (entity.product_order_state_name === "WAITING_FOR_SHIPMENT") {
                        const cartDescription = await db.CartDescription.findOne({ 
                            where: { product_order_client_side_uuid: entity.client_side_uuid },
                            order: [['id', 'DESC']]
                        }, { transaction: t });
                        
                        const { rows: cartProductEntities, count } = await new ReadCollectionCartEntitiesQuery({
                            where: { cart_client_side_uuid: cartDescription.cart_client_side_uuid },
                            include: [{ model: db.ProductEntityDescription }]
                        }).execute(db, { transaction: t });
                        
                        if (count > 0) {
                            for (const cartProductEntity of cartProductEntities) {


                                await new PutProductEntityCommand(cartProductEntity.client_side_uuid, { 
                                    product_entity_state_name: 'RESERVERED_BY_CUSTOMER_CART',
                                    product_client_side_uuid: productEntityDescription.product_client_side_uuid,
                                }).execute(db, { transaction: t });
                            }
                        }
                        
                        /**
                         * Open the cart for new product entities to be added.
                         */
                        await new PutCartCommand(cartDescription.cart_client_side_uuid, {
                            cart_state_name: 'OPEN_FOR_PRODUCT_ENTITIES'
                        }).execute(db, { transaction: t });

                        /**
                         * Remove all product entities from the cart because
                         * they are now reserved by the order.
                         * await new DeleteCartEntityCommand(cartDescription.cart_client_side_uuid)
                            .execute(db, { transaction: t });
                         */
                        
                    }
                }
            ]
        });
    }
}
