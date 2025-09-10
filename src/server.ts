import { MikroORM } from '@mikro-orm/core';
import config from './mikro-orm.config.js';
import { Product } from './modules/product.entity.js';
import { Category } from './modules/category.entity.js';
import { Tag } from './modules/tag.entity.js';
import { bootstrap } from './app.js';

try {
  const { server, port } = await bootstrap();
  console.log(`server started at http://localhost:${port}`);
} catch (e) {
  console.error(e);
}
