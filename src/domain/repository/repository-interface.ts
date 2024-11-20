export default interface RepositoryInterface<T> {
    findAll(): Promise<T[]>;
    create(entity: T): Promise<void>;
    update(entity: T): Promise<void>;
    findById(id: string): Promise<T>;
}