var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToOne, ManyToMany, Collection, } from '@mikro-orm/core';
import { Category } from './category.entity.js';
import { Tag } from './tag.entity.js';
import { BaseEntity } from './base.entity.js';
import { Order } from './order.entity.js';
let Product = class Product extends BaseEntity {
    name;
    price;
    description;
    stock;
    category;
    tags = new Collection(this);
    orders = new Collection(this);
};
__decorate([
    Property(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    ManyToOne(() => Category, { nullable: true }),
    __metadata("design:type", Object)
], Product.prototype, "category", void 0);
__decorate([
    ManyToMany(() => Tag),
    __metadata("design:type", Object)
], Product.prototype, "tags", void 0);
__decorate([
    ManyToMany(() => Order, (order) => order.products),
    __metadata("design:type", Object)
], Product.prototype, "orders", void 0);
Product = __decorate([
    Entity()
], Product);
export { Product };
