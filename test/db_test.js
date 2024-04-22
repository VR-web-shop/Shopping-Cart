import _db from '../db/models/index.cjs';
import _data from './db_data.js';

export default async function(db=_db, data=_data) {
    const queryInterface = db.sequelize.getQueryInterface();
    
    const deliverOptionModel = db.DeliverOption
    await deliverOptionModel.sync({ force: true });
    await deliverOptionModel.bulkCreate(data.deliverOptions);

    const deliverOptionDescriptionModel = db.DeliverOptionDescription
    await deliverOptionDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("deliveroptiondescriptions", "deliver_option_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await deliverOptionDescriptionModel.bulkCreate(data.deliverOptionDescriptions);

    const deliverOptionRemovedModel = db.DeliverOptionRemoved
    await deliverOptionRemovedModel.sync({ force: true });
    await deliverOptionRemovedModel.bulkCreate(data.deliverOptionRemoved);

    const paymentOptionModel = db.PaymentOption
    await paymentOptionModel.sync({ force: true });
    await paymentOptionModel.bulkCreate(data.paymentOptions);

    const paymentOptionDescriptionModel = db.PaymentOptionDescription
    await paymentOptionDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("paymentoptiondescriptions", "payment_option_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await paymentOptionDescriptionModel.bulkCreate(data.paymentOptionDescriptions);

    const paymentOptionRemovedModel = db.PaymentOptionRemoved
    await paymentOptionRemovedModel.sync({ force: true });
    await paymentOptionRemovedModel.bulkCreate(data.paymentOptionRemoved);
    
    const productModel = db.Product
    await productModel.sync({ force: true });
    await productModel.bulkCreate(data.products);

    const productDescriptionModel = db.ProductDescription
    await productDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("productdescriptions", "product_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await productDescriptionModel.bulkCreate(data.productDescriptions);

    const productRemovedModel = db.ProductRemoved
    await productRemovedModel.sync({ force: true });
    await productRemovedModel.bulkCreate(data.productRemoved);

    const productEntityStateModel = db.ProductEntityState
    await productEntityStateModel.sync({ force: true });
    await productEntityStateModel.bulkCreate(data.productEntityStates);

    const productEntityModel = db.ProductEntity
    await productEntityModel.sync({ force: true });
    await productEntityModel.bulkCreate(data.productEntities);

    const productEntityDescriptionModel = db.ProductEntityDescription
    await productEntityDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("productentitydescriptions", "product_entity_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await productEntityDescriptionModel.bulkCreate(data.productEntityDescriptions);

    const productEntityRemovedModel = db.ProductEntityRemoved
    await productEntityRemovedModel.sync({ force: true });
    await productEntityRemovedModel.bulkCreate(data.productEntityRemoved);

    const productOrderStateModel = db.ProductOrderState
    await productOrderStateModel.sync({ force: true });
    await productOrderStateModel.bulkCreate(data.productOrderStates);

    const productOrderModel = db.ProductOrder
    await productOrderModel.sync({ force: true });
    await productOrderModel.bulkCreate(data.productOrders);

    const productOrderDescriptionModel = db.ProductOrderDescription
    await productOrderDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("productorderdescriptions", "product_order_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await productOrderDescriptionModel.bulkCreate(data.productOrderDescriptions);

    const productOrderRemovedModel = db.ProductOrderRemoved
    await productOrderRemovedModel.sync({ force: true });
    await productOrderRemovedModel.bulkCreate(data.productOrderRemoved);

    const productOrderEntityModel = db.ProductOrderEntity
    await productOrderEntityModel.sync({ force: true });
    await productOrderEntityModel.bulkCreate(data.productOrderEntities);

    const productOrderEntityDescriptionModel = db.ProductOrderEntityDescription
    await productOrderEntityDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("productorderentitydescriptions", "product_order_entity_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await productOrderEntityDescriptionModel.bulkCreate(data.productOrderEntityDescriptions);

    const productOrderEntityRemovedModel = db.ProductOrderEntityRemoved
    await productOrderEntityRemovedModel.sync({ force: true });
    await productOrderEntityRemovedModel.bulkCreate(data.productOrderEntityRemoved);

    const cartStateModel = db.CartState
    await cartStateModel.sync({ force: true });
    await cartStateModel.bulkCreate(data.cartStates);

    const cartModel = db.Cart
    await cartModel.sync({ force: true });
    await cartModel.bulkCreate(data.carts);

    const cartDescriptionModel = db.CartDescription
    await cartDescriptionModel.sync({ force: true });
    // This is a workaround to remove the default unique constraints on the foreign keys
    await queryInterface.changeColumn("cartdescriptions", "cart_client_side_uuid", { type: db.Sequelize.DataTypes.STRING, allowNull: false, unique: false });
    await cartDescriptionModel.bulkCreate(data.cartDescriptions);

    const cartProductEntityModel = db.CartProductEntity
    await cartProductEntityModel.sync({ force: true });
    await cartProductEntityModel.bulkCreate(data.cartProductEntities);

    const cartProductEntityRemovedModel = db.CartProductEntityRemoved
    await cartProductEntityRemovedModel.sync({ force: true });
    await cartProductEntityRemovedModel.bulkCreate(data.cartProductEntityRemoved);

    return {
        db,
        data
    }
}
