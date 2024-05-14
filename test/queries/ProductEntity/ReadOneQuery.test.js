import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/ProductEntity/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a product entity', async () => {
  const data = db.data.productEntities[0];
  const dataDescription = db.data.productEntityDescriptions[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(entity.client_side_uuid).toBe(data.client_side_uuid);
  expect(entity.product_client_side_uuid).toBe(dataDescription.product_client_side_uuid);
  expect(entity.product_entity_state_name).toBe(dataDescription.product_entity_state_name);
});

test('ReadOneQuery should throw an error if product entity does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if product entity does exist but has a tombstone', async () => {
  const data = db.data.productEntities[1];
  const cmd = new ReadOneQuery(data.client_side_uuid);
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

