import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/ProductEntity/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a product entity', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { product_client_side_uuid: 'aaa-bbb-ccc', product_entity_state_name: 'Available' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductEntity.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductEntityDescription.findOne({ 
        where: { product_entity_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.product_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.product_entity_state_name).toBe('Available')
});

test('PutCommand should update a product entity if it exist', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { product_client_side_uuid: 'aaa-bbb-ccc', product_entity_state_name: 'Unavailable' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductEntity.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductEntityDescription.findOne({ 
        where: { product_entity_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.product_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.product_entity_state_name).toBe('Unavailable')
})
