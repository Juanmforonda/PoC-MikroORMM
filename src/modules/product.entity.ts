import {
  Entity,
  Property,
  ManyToOne,
  ManyToMany,
  Collection,
} from '@mikro-orm/core';
import { Category } from './category.entity.js';
import { Tag } from './tag.entity.js';
import { BaseEntity } from './base.entity.js';

@Entity()
export class Product extends BaseEntity {
  @Property()
  name!: string;

  @Property()
  price!: number;

  @Property()
  description!: string;

  @Property()
  stock!: number;

  @ManyToOne(() => Category, { nullable: false })
  category!: Category;

  @ManyToMany(() => Tag)
  tags = new Collection<Tag>(this);
}
