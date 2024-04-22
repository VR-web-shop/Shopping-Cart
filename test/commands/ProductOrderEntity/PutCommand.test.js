import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/ProductOrderEntity/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a product order entity', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { product_order_client_side_uuid: 'aaa-bbb-ccc', product_entity_client_side_uuid: 'aaa-bbb-ccc' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductOrderEntity.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductOrderEntityDescription.findOne({ 
        where: { product_order_entity_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.product_order_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.product_entity_client_side_uuid).toBe('aaa-bbb-ccc')
});

test('PutCommand should update a product order entity if it exist', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { product_order_client_side_uuid: 'aaa-bbb-ccc3', product_entity_client_side_uuid: 'aaa-bbb-ccc3' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductOrderEntity.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductOrderEntityDescription.findOne({ 
        where: { product_order_entity_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.product_order_client_side_uuid).toBe('aaa-bbb-ccc3')
    expect(desc.product_entity_client_side_uuid).toBe('aaa-bbb-ccc3')
})
