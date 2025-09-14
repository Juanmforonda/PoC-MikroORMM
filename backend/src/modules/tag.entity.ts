import {
  Entity,
  PrimaryKey,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Product } from './product.entity.js';
import { BaseEntity } from './base.entity.js';

@Entity()
export class Tag extends BaseEntity {
  @Property()
  name!: string;

  @Property({ nullable: true })
  description?: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products = new Collection<Product>(this);
}
