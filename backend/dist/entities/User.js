var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, PrimaryKey, Property, OneToMany, ManyToOne, ManyToMany, } from '@mikro-orm/core';
let Product = class Product {
    id;
    createdAt = new Date();
    updatedAt = new Date();
    name;
    price;
    description;
    stock;
    category;
    tags = [];
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Product.prototype, "id", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Product.prototype, "createdAt", void 0);
__decorate([
    Property({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], Product.prototype, "updatedAt", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Product.prototype, "name", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Product.prototype, "price", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Product.prototype, "description", void 0);
__decorate([
    Property(),
    __metadata("design:type", Number)
], Product.prototype, "stock", void 0);
__decorate([
    ManyToOne(() => Category),
    __metadata("design:type", Category)
], Product.prototype, "category", void 0);
__decorate([
    ManyToMany(() => Tag, (tag) => tag.products),
    __metadata("design:type", Array)
], Product.prototype, "tags", void 0);
Product = __decorate([
    Entity()
], Product);
export { Product };
let Category = class Category {
    id;
    createdAt = new Date();
    updatedAt = new Date();
    name;
    description;
    products = [];
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Category.prototype, "id", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Category.prototype, "createdAt", void 0);
__decorate([
    Property({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], Category.prototype, "updatedAt", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Category.prototype, "name", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Category.prototype, "description", void 0);
__decorate([
    OneToMany(() => Product, (product) => product.category),
    __metadata("design:type", Array)
], Category.prototype, "products", void 0);
Category = __decorate([
    Entity()
], Category);
export { Category };
let Tag = class Tag {
    id;
    createdAt = new Date();
    updatedAt = new Date();
    name;
    description;
    products = [];
};
__decorate([
    PrimaryKey(),
    __metadata("design:type", Number)
], Tag.prototype, "id", void 0);
__decorate([
    Property({ onCreate: () => new Date() }),
    __metadata("design:type", Object)
], Tag.prototype, "createdAt", void 0);
__decorate([
    Property({ onUpdate: () => new Date() }),
    __metadata("design:type", Object)
], Tag.prototype, "updatedAt", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Tag.prototype, "name", void 0);
__decorate([
    Property(),
    __metadata("design:type", String)
], Tag.prototype, "description", void 0);
__decorate([
    ManyToMany(() => Product, (product) => product.tags),
    __metadata("design:type", Array)
], Tag.prototype, "products", void 0);
Tag = __decorate([
    Entity()
], Tag);
export { Tag };
