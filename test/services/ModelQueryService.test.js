import { expect, test, beforeAll } from 'vitest'
import ModelQueryService from '../../src/services/ModelQueryService.js';
import ModelQuery from '../../src/queries/abstractions/ModelQuery.js';

let queryService, testQuery;

beforeAll(async () => {
  queryService = new ModelQueryService();
  testQuery = (class TestQuery extends ModelQuery {
    constructor() {
      super();
    }

    async execute(db) {
      return db;
    }
  });
});

test('The query service should pass the db to commands on invokation', async () => {
    const db = queryService.invoke(new testQuery());
    expect(db).toBeDefined();
});
