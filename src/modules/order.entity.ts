import {
  Entity,
  Property,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { BaseEntity } from './base.entity.js';
import { Product } from './product.entity.js';

@Entity()
export class Order extends BaseEntity {


  @Property({ unique: true })
  orderNumber!: string;

  @Property({ type: 'decimal', precision: 10, scale: 2 })
  total!: number;

  @Property({ default: 'proceso' })
  status!: string; // proceso, completado, cancelado

  @ManyToMany(() => Product)
  products = new Collection<Product>(this);
}
