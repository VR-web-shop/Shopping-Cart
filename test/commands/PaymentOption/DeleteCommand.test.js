import { expect, test, beforeAll } from 'vitest';
import db_test from '../../db_test.js';

import DeleteCommand from '../../../src/commands/PaymentOption/DeleteCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('DeleteCommand should soft delete a payment option', async () => {
    const client_side_uuid = testDB.data.paymentOptions[0].client_side_uuid;
    await commandService.invoke(new DeleteCommand(client_side_uuid));
    const entity = await testDB.db.PaymentOption.findOne({ where: { client_side_uuid } });
    const removed = await testDB.db.PaymentOptionRemoved.findOne({ where: { 
      payment_option_client_side_uuid: client_side_uuid 
    } });

    expect(removed).toBeDefined();
    expect(removed.deleted_at).toBeDefined();
    expect(removed.deleted_at).not.toBeNull();
    expect(removed.payment_option_client_side_uuid).toBe(client_side_uuid);
    expect(entity).toBeDefined();
    expect(entity.client_side_uuid).toBe(client_side_uuid);
});
