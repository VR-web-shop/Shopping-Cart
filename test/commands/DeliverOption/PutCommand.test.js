import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import PutCommand from '../../../src/commands/DeliverOption/PutCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});


test('PutCommand should create a deliver option', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { name: 'ddd', price: 100 }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.DeliverOption.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.DeliverOptionDescription.findOne({ 
        where: { deliver_option_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('ddd')
    expect(desc.price).toBe(100)
});

test('PutCommand should update a deliver option if it exist', async () => {
    const client_side_uuid = 'aaa3-bxbb3-ccxc3';
    const params = { name: 'eee', price: 300 }
    await commandService.invoke(new PutCommand(client_side_uuid, params));
    const entity = await testDB.db.DeliverOption.findOne({ where: { client_side_uuid }})
    const desc = await testDB.db.DeliverOptionDescription.findOne({ 
        where: { deliver_option_client_side_uuid: client_side_uuid },
        order: [['created_at', 'DESC']]
    })

    expect(entity.client_side_uuid).toBe(client_side_uuid)
    expect(desc.name).toBe('eee')
    expect(desc.price).toBe(300)
})
