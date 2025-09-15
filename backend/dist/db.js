import { MikroORM, } from '@mikro-orm/mysql';
import { Product } from './modules/product.entity.js';
import { Category } from './modules/category.entity.js';
import { Tag } from './modules/tag.entity.js';
import { Order } from './modules/order.entity.js';
let cache;
export async function initORM(options) {
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
