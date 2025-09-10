import { MikroORM, RequestContext } from '@mikro-orm/core';
import express from 'express';
import { Product } from './modules/product.entity.js';
import { initORM } from './db.js';

export async function bootstrap(port = 3001) {
  const db = await initORM();
  const app = express();

  // Middleware para JSON parsing (equivalente a Fastify automático)
  app.use(express.json());

  // Middleware para crear Request Context (equivalente al hook onRequest)
  app.use((req, res, next) => {
    RequestContext.create(db.em, next);
  });

  // register routes here
  // ...

  app.get('/product', async (request) => {
    const { limit, offset } = request.query as {
      limit?: number;
      offset?: number;
    };
    const [items, total] = await db.em.findAndCount(
      Product,
      {},
      {
        limit,
        offset,
      }
    );

    return { items, total };
  });

  const server = app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });

  

  // Manejo de cierre graceful (equivalente al hook onClose)
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
