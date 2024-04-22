import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/ProductOrderState/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a product order state', async () => {
  const data = db.data.productOrderStates[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.name));

  expect(entity.name).toBe(data.name);
});

test('ReadOneQuery should throw an error if product order state does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})
