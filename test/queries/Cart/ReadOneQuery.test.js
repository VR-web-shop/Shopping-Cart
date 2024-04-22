import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/Cart/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a cart', async () => {
  const data = db.data.carts[0];
  const desc = db.data.cartDescriptions[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(entity.client_side_uuid).toBe(data.client_side_uuid);
  expect(desc.cart_state_name).toBe('Active');
});

test('ReadOneQuery should throw an error if cart does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})
