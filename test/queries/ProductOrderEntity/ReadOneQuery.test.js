import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/ProductOrderEntity/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a product order entity', async () => {
  const data = db.data.productOrderEntities[0];
  const dataDescription = db.data.productOrderEntityDescriptions[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(entity.client_side_uuid).toBe(data.client_side_uuid);
  expect(entity.product_order_client_side_uuid).toBe(dataDescription.product_order_client_side_uuid);
  expect(entity.product_entity_client_side_uuid).toBe(dataDescription.product_entity_client_side_uuid);
});

test('ReadOneQuery should throw an error if product order entity does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if product order entity does exist but has a tombstone', async () => {
  const data = db.data.productOrderEntities[1];
  const cmd = new ReadOneQuery(data.client_side_uuid);
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

