import type { EntityData, EntityManager, Constructor } from '@mikro-orm/core';
export declare abstract class Factory<TEntity extends object, TInput = EntityData<TEntity>> {
    protected readonly em: EntityManager;
    abstract readonly model: Constructor<TEntity>;
    private eachFunction?;
    constructor(em: EntityManager);
    protected abstract definition(input?: TInput): EntityData<TEntity>;
    /**
     * Make a single entity instance, without persisting it.
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    makeEntity(input?: TInput, index?: number): TEntity;
    /**
     * Make a single entity and persist (not flush)
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    makeOne(input?: TInput): TEntity;
    /**
     * Make multiple entities and then persist them (not flush)
     * @param amount Number of entities that should be generated
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    make(amount: number, input?: TInput): TEntity[];
    /**
     * Create (and flush) a single entity
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    createOne(input?: TInput): Promise<TEntity>;
    /**
     * Create (and flush) multiple entities
     * @param amount Number of entities that should be generated
     * @param input Object specifying what default attributes of the entity factory should be overridden
     */
    create(amount: number, input?: TInput): Promise<TEntity[]>;
    /**
     * Set a function that is applied to each entity before it is returned
     * In case of `createOne` or `create` it is applied before the entity is persisted
     * @param eachFunction The function that is applied on every entity
     */
    each(eachFunction: (entity: TEntity, index: number) => void): this;
}
