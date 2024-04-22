import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/ProductOrder/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a product order', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { name: 'ddd', email: 'test', address: 'test', city: 'test', country: 'test', postal_code: 'test', product_order_state_name: 'Pending', deliver_option_client_side_uuid: 'aaa-bbb-ccc', payment_option_client_side_uuid: 'aaa-bbb-ccc' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductOrder.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductOrderDescription.findOne({ 
        where: { product_order_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('ddd')
    expect(desc.email).toBe('test')
    expect(desc.address).toBe('test')
    expect(desc.city).toBe('test')
    expect(desc.country).toBe('test')
    expect(desc.postal_code).toBe('test')
    expect(desc.product_order_state_name).toBe('Pending')
    expect(desc.deliver_option_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.payment_option_client_side_uuid).toBe('aaa-bbb-ccc')
});

test('PutCommand should update a product order if it exist', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { name: 'eee', email: 'eee', address: 'eee', city: 'eee', country: 'eee', postal_code: 'eee', product_order_state_name: 'Pending', deliver_option_client_side_uuid: 'aaa-bbb-ccc', payment_option_client_side_uuid: 'aaa-bbb-ccc' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.ProductOrder.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.ProductOrderDescription.findOne({ 
        where: { product_order_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('eee')
    expect(desc.email).toBe('eee')
    expect(desc.address).toBe('eee')
    expect(desc.city).toBe('eee')
    expect(desc.country).toBe('eee')
    expect(desc.postal_code).toBe('eee')
    expect(desc.product_order_state_name).toBe('Pending')
    expect(desc.deliver_option_client_side_uuid).toBe('aaa-bbb-ccc')
    expect(desc.payment_option_client_side_uuid).toBe('aaa-bbb-ccc')
})
