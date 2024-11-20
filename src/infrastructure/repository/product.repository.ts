import Product from "../../domain/entity/product";
import ProductRepositoryInterface from "../../domain/repository/product-repository.interface";
import ProductModel from "../db/sequelize/model/product.model";

export default class ProductRepository implements ProductRepositoryInterface {
    async create(entity: Product): Promise<void> {
        await ProductModel.create({
            id: entity.id,
            name: entity.name,
            price: entity.price
        })
        return Promise.resolve();
    }
     
    async update(entity: Product): Promise<void> {
        await ProductModel.update({ name: entity.name, price: entity.price }, { where: { id: entity.id } });
        return Promise.resolve();
    }

    async findById(id: string): Promise<Product> {
        const productModel = await ProductModel.findOne({ where: { id: id } });

        return new Product(productModel.id, productModel.name, productModel.price);
    }
    async findAll(): Promise<Product[]> {
        const productModels = await ProductModel.findAll();
        const products = productModels.map(productModel => new Product(productModel.id, productModel.name, productModel.price));
        return Promise.resolve(products);
    }

}