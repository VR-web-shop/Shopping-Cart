import _DeleteCommand from "../abstractions/DeleteCommand.js";
import PutProductEntityCommand from "../ProductEntity/PutCommand.js";

export default class DeleteCommand extends _DeleteCommand {
    constructor(clientSideUUID) {
        super(
            clientSideUUID, 
            "client_side_uuid",
            "cart_product_entity_client_side_uuid",
            "CartProductEntity",
            "CartProductEntityRemoved"
        );
    }

    async execute(db) {
        await super.execute(db, {
            afterTransactions: [
                async (t, entity) => {
                    console.log('entity', entity);
                    const product_entity_client_side_uuid = entity.product_entity_client_side_uuid;
                    const productEntityDescription = await db.ProductEntityDescription.findOne({
                        where: { product_entity_client_side_uuid },
                        order: [['id', 'DESC']]
                    }, { transaction: t });
                    await new PutProductEntityCommand(product_entity_client_side_uuid, { 
                        product_entity_state_name: 'AVAILABLE_FOR_PURCHASE',
                        product_client_side_uuid: productEntityDescription.product_client_side_uuid
                    }).execute(db, { transaction: t });
                }
            ]
        });
    }
}
