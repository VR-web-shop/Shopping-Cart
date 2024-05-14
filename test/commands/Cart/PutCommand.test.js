import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/Cart/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a cart', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { cart_state_name: 'Active' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.Cart.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.CartDescription.findOne({ 
        where: { cart_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.cart_state_name).toBe('Active')
});

test('PutCommand should update a cart if it exist', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { cart_state_name: 'Inactive' }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.Cart.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.CartDescription.findOne({ 
        where: { cart_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.cart_state_name).toBe('Inactive')
})
