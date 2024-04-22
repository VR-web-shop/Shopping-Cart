import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/ProductOrder/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a product order', async () => {
  const data = db.data.productOrders[0];
  const dataDescription = db.data.productOrderDescriptions[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(entity.client_side_uuid).toBe(data.client_side_uuid);
  expect(entity.name).toBe(dataDescription.name);
  expect(entity.email).toBe(dataDescription.email);
  expect(entity.address).toBe(dataDescription.address);
  expect(entity.city).toBe(dataDescription.city);
  expect(entity.country).toBe(dataDescription.country);
  expect(entity.postal_code).toBe(dataDescription.postal_code);
  expect(entity.product_order_state_name).toBe(dataDescription.product_order_state_name);
  expect(entity.deliver_option_client_side_uuid).toBe(dataDescription.deliver_option_client_side_uuid);
  expect(entity.payment_option_client_side_uuid).toBe(dataDescription.payment_option_client_side_uuid);
});

test('ReadOneQuery should throw an error if product order does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if product order does exist but has a tombstone', async () => {
  const data = db.data.productOrders[1];
  const cmd = new ReadOneQuery(data.client_side_uuid);
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

