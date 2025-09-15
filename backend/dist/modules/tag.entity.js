var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Property, ManyToMany, Collection, } from '@mikro-orm/core';
import { Product } from './product.entity.js';
import { BaseEntity } from './base.entity.js';
let Tag = class Tag extends BaseEntity {
    name;
    description;
    products = new Collection(this);
};
__decorate([
    Property(),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    Property({ nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "description", void 0);
__decorate([
    ManyToMany(() => Product, (product) => product.tags),
    __metadata("design:type", Object)
], Tag.prototype, "products", void 0);
Tag = __decorate([
    Entity()
], Tag);
export { Tag };
