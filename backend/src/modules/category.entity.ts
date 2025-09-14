import { Entity, PrimaryKey, Property, OneToMany, Collection } from '@mikro-orm/core';
import { BaseEntity } from './base.entity.js';
import { Product } from './product.entity.js';

@Entity()
export class Category extends BaseEntity {

  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @OneToMany(() => 'Product', 'category')
  products = new Collection<Product>(this);
}
