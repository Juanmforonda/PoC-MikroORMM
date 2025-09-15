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
import { BaseEntity } from './base.entity.js';
import { Product } from './product.entity.js';
let Order = class Order extends BaseEntity {
    orderNumber;
    total;
    status; // proceso, completado, cancelado
    products = new Collection(this);
};
__decorate([
    Property({ unique: true }),
    __metadata("design:type", String)
], Order.prototype, "orderNumber", void 0);
__decorate([
    Property({ type: 'decimal', precision: 10, scale: 2 }),
    __metadata("design:type", Number)
], Order.prototype, "total", void 0);
__decorate([
    Property({ default: 'proceso' }),
    __metadata("design:type", String)
], Order.prototype, "status", void 0);
__decorate([
    ManyToMany(() => Product),
    __metadata("design:type", Object)
], Order.prototype, "products", void 0);
Order = __decorate([
    Entity()
], Order);
export { Order };
