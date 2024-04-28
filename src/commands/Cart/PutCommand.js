import _PutCommand from "../abstractions/PutCommand.js";
import ProductOrderPutCommand from "../ProductOrder/PutCommand.js";
import { v4 } from 'uuid';

export default class PutCommand extends _PutCommand {
    constructor(clientSideUUID, params, product_order) {
        super(
            clientSideUUID,
            params,
            "client_side_uuid",
            "cart_client_side_uuid",
            ["cart_state_name"],
            "Cart",
            "CartDescription",
            null
        );

        this.product_order = product_order;
    }

    async execute(db) {
        await super.execute(db, {
            afterTransactions: [
                async (t, entity, snapshot) => {
                    
                    const newSnapshot = snapshot;
                    const oldSnapshot = entity.CartDescriptions && entity.CartDescriptions.length > 0
                        ? entity.CartDescriptions[0]
                        : null;

                    // If the customer has any open orders and they cancel the checkout,
                    // we should cancel the orders as well.
                    const oldProductOrderUUID = oldSnapshot && oldSnapshot.product_order_client_side_uuid;
                    const isOpenForProductEntities = oldSnapshot && newSnapshot.cart_state_name === 'OPEN_FOR_PRODUCT_ENTITIES';
                    const shouldRemoveProductOrder = oldProductOrderUUID && isOpenForProductEntities;
                    if (shouldRemoveProductOrder) {
                        await PutCommand.removeProductOrder(db, t, oldSnapshot, newSnapshot);
                        return;
                    }

                    // If the customer has does not have any open orders and they start the checkout,
                    // we should create a new order.
                    const isWaitingForCheckout = newSnapshot.cart_state_name === 'WAITING_FOR_CHECKOUT';
                    const shouldAddProductOrder = (
                        (!oldSnapshot && isWaitingForCheckout) ||
                        (!oldProductOrderUUID && isWaitingForCheckout)
                    );
                    if (shouldAddProductOrder) {
                        await PutCommand.addProductOrder(db, t, newSnapshot, this.product_order);
                    }
                }
            ]
        });
    }

    /**
     * When a cart is moved to the WAITING_FOR_CHECKOUT state, a product order is created.
     */
    static async addProductOrder(db, t, newSnapshot, product_order) {
        if (!product_order) throw new Error(`
            A cart waiting for checkout must have a product order. 
            Add a product order to the request: { ..., product_order: { ... } }
        `);

        const uuid = v4();
        
        await new ProductOrderPutCommand(uuid, {
            product_order_state_name: 'WAITING_FOR_PAYMENT',
            ...product_order,
        }).execute(db, { transaction: t });

        await db.CartDescription.create({
            cart_client_side_uuid: newSnapshot.cart_client_side_uuid,
            cart_state_name: newSnapshot.cart_state_name,
            product_order_client_side_uuid: uuid,
        }, { transaction: t });
    }

    /**
     * When a cart is moved to the OPEN_FOR_PRODUCT_ENTITIES state, a product order is removed.
     */
    static async removeProductOrder(db, t, oldSnapshot, newSnapshot) {
        const uuid = oldSnapshot.product_order_client_side_uuid;
        const productOrder = await db.ProductOrderDescription.findOne(
            {
                where: { product_order_client_side_uuid: uuid },
                order: [['id', 'DESC']],
            },
            { transaction: t }
        );

        await new ProductOrderPutCommand(uuid, {
            product_order_state_name: 'CANCELLED_BY_CUSTOMER',
            name: productOrder.name,
            email: productOrder.email,
            address: productOrder.address,
            city: productOrder.city,
            country: productOrder.country,
            postal_code: productOrder.postal_code,
            deliver_option_client_side_uuid: productOrder.deliver_option_client_side_uuid,
            payment_option_client_side_uuid: productOrder.payment_option_client_side_uuid,
        }).execute(db, { transaction: t });

        await db.CartDescription.create({
            cart_client_side_uuid: newSnapshot.cart_client_side_uuid,
            cart_state_name: newSnapshot.cart_state_name,
            product_order_client_side_uuid: null,
        }, { transaction: t });
    }
}
