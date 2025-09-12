import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { Product } from '../modules/product.entity.js';

export class TestSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {

    em.create(Product, { 
      name: 'Test Product 1',
      price: 10.99,
      description: 'Descripcion de producto',
      stock: 100,
      category: {
        name: 'Test Category',
        description: 'Descripcion de categoria'
      },
      tags: [{name: 'Tag1', description: 'Descripcion de Tag1'}, {name: 'Tag2', description: 'Descripcion de Tag2'}],
    });
  }

}

// Runear el seeder con el CLI de MikroORM
// npx mikro-orm seeder:run / npx mikro-orm-esm seeder:run <-- para ese se debe tener un seeder class DatabaseSeeder
// o para un seeder específico
// npx mikro-orm-esm seeder:run --class=TestSeeder