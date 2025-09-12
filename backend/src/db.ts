import {
  EntityManager,
  EntityRepository,
  MikroORM,
  Options,
} from '@mikro-orm/mysql';
import { Product } from './modules/product.entity.js';
import { Category } from './modules/category.entity.js';
import { Tag } from './modules/tag.entity.js';
import { Order } from './modules/order.entity.js';

export interface Services {
  orm: MikroORM;
  em: EntityManager;
  product: EntityRepository<Product>;
  category: EntityRepository<Category>;
  tag: EntityRepository<Tag>;
  order: EntityRepository<Order>;
}

let cache: Services;

export async function initORM(options?: Options): Promise<Services> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(options);

  // save to cache before returning
  return (cache = {
    orm,
    em: orm.em,
    product: orm.em.getRepository(Product),
    category: orm.em.getRepository(Category),
    tag: orm.em.getRepository(Tag),
    order: orm.em.getRepository(Order),
  });
}
