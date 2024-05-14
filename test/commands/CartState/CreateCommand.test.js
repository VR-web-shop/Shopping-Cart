import { expect, test, beforeAll } from 'vitest'
import db_test from '../../db_test.js';

import CreateCommand from '../../../src/commands/CartState/CreateCommand.js';
import ModelCommandService from '../../../src/services/ModelCommandService.js';

let commandService, testDB;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testDB = await db_test();
});

test('CreateCommand should create a new cart state', async () => {
    await commandService.invoke(new CreateCommand('Available2'));
    const state = await testDB.db.CartState.findOne({ 
      where: { name: 'Available2' }
    });

    expect(state.name).toBe('Available2')  
});

test('CreateCommand should throw an error if a cart state if name already exist', async () => {
  const cmd = new CreateCommand('Available2');
  expect(async () => await commandService.invoke(cmd)).rejects.toThrowError();
});
