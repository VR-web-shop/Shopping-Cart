import _CreateCommand from "../abstractions/CreateCommand.js";
import PutProductEntityCommand from "../ProductEntity/PutCommand.js";

export default class CreateCommand extends _CreateCommand {
    constructor(clientSideUUID, params) {
        super(
            clientSideUUID, 
            params, 
            "client_side_uuid",
            "CartProductEntity"
        );
    }

    async execute(db) {
        await super.execute(db, {
            afterTransactions: [
                async (t, entity, snapshot) => {
                    const product_entity_client_side_uuid = this.params.product_entity_client_side_uuid;
                    const productEntityDescription = await db.ProductEntityDescription.findOne({
                        where: { product_entity_client_side_uuid },
                        order: [['id', 'DESC']]
                    }, { transaction: t });
                    await new PutProductEntityCommand(product_entity_client_side_uuid, { 
                        product_entity_state_name: 'RESERVERED_BY_CUSTOMER_CART',
                        product_client_side_uuid: productEntityDescription.product_client_side_uuid
                    }).execute(db, { transaction: t });
                }
            ]
        });
    }
}
