import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import CreateCommand from '../../../src/commands/CartProductEntity/CreateCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('CreateCommand should create a new cart product entity', async () => {
  const client_side_uuid = 'aaa3-bxbb3-ccxc3';
  const params = { cart_client_side_uuid: 'aaa-bbb-ccc', product_entity_client_side_uuid: 'aaa-bbb-ccc' }
  await commandService.invoke(new CreateCommand(client_side_uuid, params));
  const entity = await testDB.db.CartProductEntity.findOne({ 
      where: { client_side_uuid }
  });

  expect(entity.client_side_uuid).toBe(client_side_uuid) 
  expect(entity.cart_client_side_uuid).toBe('aaa-bbb-ccc')
  expect(entity.product_entity_client_side_uuid).toBe('aaa-bbb-ccc') 
});

test('CreateCommand should throw an error if a cart product entity with client side uuid already exist', async () => {
  const client_side_uuid = 'aaa3-bxbb3-ccxc3';
  const params = { cart_client_side_uuid: 'aaa-bbb-ccc', product_entity_client_side_uuid: 'aaa-bbb-ccc' }
  const cmd = new CreateCommand(client_side_uuid, params);
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError();
});
