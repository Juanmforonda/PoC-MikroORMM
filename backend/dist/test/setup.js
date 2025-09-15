import { beforeAll, afterAll } from 'vitest';
import { initORM } from '../db.js';
let services;
beforeAll(async () => {
    services = await initORM();
    // Crear una base de datos de test limpia
    await services.orm.schema.refreshDatabase();
});
afterAll(async () => {
    await services.orm.close();
});
export { services };
