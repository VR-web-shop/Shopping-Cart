import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import ReadOneQuery from '../../../src/queries/PaymentOption/ReadOneQuery.js';
import ModelQueryService from '../../../src/services/ModelQueryService.js';

let queryService, db;

beforeAll(async () => {
  queryService = new ModelQueryService();
  db = await db_test();
});

test('ReadOneQuery should read a payment option', async () => {
  const data = db.data.paymentOptions[0];
  const dataDescription = db.data.paymentOptionDescriptions[0];
  const entity = await queryService.invoke(new ReadOneQuery(data.client_side_uuid));

  expect(entity.client_side_uuid).toBe(data.client_side_uuid);
  expect(entity.name).toBe(dataDescription.name);
  expect(entity.price).toBe(dataDescription.price);
});

test('ReadOneQuery should throw an error if payment option does not exist', async () => {
  const cmd = new ReadOneQuery('zzz-yyy-xxx');
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

test('ReadOneQuery should throw an error if payment option does exist but has a tombstone', async () => {
  const data = db.data.paymentOptions[1];
  const cmd = new ReadOneQuery(data.client_side_uuid);
  expect(queryService.invoke(cmd)).rejects.toThrowError();
})

