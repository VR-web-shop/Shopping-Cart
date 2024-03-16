import 'dotenv/config'
import database from './src/models/Database.js';

(async () => {
    await database.sync({ force: true });
})();
