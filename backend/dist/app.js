import { RequestContext } from '@mikro-orm/core';
import express from 'express';
import cors from 'cors';
import { initORM } from './db.js';
import productRouter from './routes/product.routes.js';
import categoryRouter from './routes/category.router.js';
import tagRouter from './routes/tag.routes.js';
import orderRouter from './routes/order.routes.js';
export async function bootstrap(port = 3001) {
    const db = await initORM();
    const app = express();
    app.use(cors({
        origin: 'http://localhost:5173',
        credentials: true,
    }));
    app.use(express.json());
    // Middleware para crear Request Context 
    app.use((req, res, next) => {
        RequestContext.create(db.em, next);
    });
    // ...
    app.use('/api/products', productRouter);
    app.use('/api/categories', categoryRouter);
    app.use('/api/tags', tagRouter);
    app.use('/api/orders', orderRouter);
    const server = app.listen(port, () => {
        console.log(`Server running on http://localhost:${port}`);
    });
    // Manejo de cierre graceful
    const gracefulShutdown = async () => {
        console.log('Shutting down gracefully...');
        server.close(async () => {
            await db.orm.close();
            process.exit(0);
        });
    };
    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
    return { app, server, port };
}
