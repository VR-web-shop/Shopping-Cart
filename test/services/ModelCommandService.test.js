import { expect, test, beforeAll } from 'vitest'
import ModelCommandService from '../../src/services/ModelCommandService.js';
import ModelCommand from '../../src/commands/abstractions/ModelCommand.js';

let commandService, testCommand;

beforeAll(async () => {
  commandService = new ModelCommandService();
  testCommand = (class TestCommand extends ModelCommand {
    constructor() {
      super();
    }

    async execute(db) {
      return db;
    }
  });
});

test('The command service should pass the db to commands on invokation', async () => {
    const db = commandService.invoke(new testCommand());
    expect(db).toBeDefined();
});
