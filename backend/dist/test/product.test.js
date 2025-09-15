import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import request from 'supertest';
import { bootstrap } from '../app.js';
import { services } from './setup.js';
import { Product } from '../modules/product.entity.js';
import { Category } from '../modules/category.entity.js';
describe('Product API', () => {
    let app;
    let server;
    beforeEach(async () => {
        // Limpiar la base de datos antes de cada test
        await services.orm.schema.refreshDatabase();
        // Inicializar la app
        const result = await bootstrap(0); // Puerto 0 = puerto aleatorio
        app = result.app;
        server = result.server;
    });
    afterEach(async () => {
        if (server) {
            server.close();
        }
    });
    it('should return empty array when no products exist', async () => {
        const response = await request(app)
            .get('/product')
            .expect(200);
        expect(response.body).toEqual({
            items: [],
            total: 0,
            limit: undefined,
            offset: undefined
        });
    });
    it('should return products when they exist', async () => {
        // Crear datos de prueba
        const category = new Category();
        category.name = 'Test Category';
        category.description = 'Test Description';
        await services.em.persistAndFlush(category);
        const product = new Product();
        product.name = 'Test Product';
        product.price = 100;
        product.description = 'Test Product Description';
        product.stock = 10;
        product.category = category;
        await services.em.persistAndFlush(product);
        // Limpiar el contexto
        services.em.clear();
        // Hacer la petición
        const response = await request(app)
            .get('/product')
            .expect(200);
        expect(response.body.items).toHaveLength(1);
        expect(response.body.total).toBe(1);
        expect(response.body.items[0]).toMatchObject({
            name: 'Test Product',
            price: 100,
            description: 'Test Product Description',
            stock: 10
        });
    });
    it('should handle pagination parameters', async () => {
        const response = await request(app)
            .get('/product?limit=5&offset=0')
            .expect(200);
        expect(response.body.limit).toBe('5'); // Query params son strings
        expect(response.body.offset).toBe('0');
    });
});
