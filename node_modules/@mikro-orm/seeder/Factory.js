"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Factory = void 0;
class Factory {
    em;
    eachFunction;
    constructor(em) {
        this.em = em;
    }
    /**
     * Make a single entity instance, without persisting it.
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    makeEntity(input, index = 0) {
        const data = this.definition.length === 0
            ? {
                ...this.definition(),
                ...input,
            }
            : this.definition(input);
        const entity = this.em.create(this.model, data, { persist: false });
        this.eachFunction?.(entity, index);
        return entity;
    }
    /**
     * Make a single entity and persist (not flush)
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    makeOne(input) {
        const entity = this.makeEntity(input);
        this.em.persist(entity);
        return entity;
    }
    /**
     * Make multiple entities and then persist them (not flush)
     * @param amount Number of entities that should be generated
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    make(amount, input) {
        const entities = [...Array(amount)].map((_, index) => {
            return this.makeEntity(input, index);
        });
        this.em.persist(entities);
        return entities;
    }
    /**
     * Create (and flush) a single entity
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    async createOne(input) {
        const entity = this.makeOne(input);
        await this.em.flush();
        return entity;
    }
    /**
     * Create (and flush) multiple entities
     * @param amount Number of entities that should be generated
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    async create(amount, input) {
        const entities = this.make(amount, input);
        await this.em.flush();
        return entities;
    }
    /**
     * Set a function that is applied to each entity before it is returned
     * In case of `createOne` or `create` it is applied before the entity is persisted
     * @param eachFunction The function that is applied on every entity
     */
    each(eachFunction) {
        this.eachFunction = eachFunction;
        return this;
    }
}
exports.Factory = Factory;
