import Product from "./product";

describe('Product unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => new Product("", "Product 1", 10)).toThrowError("Id is required");
    })  

    it('should throw error when name is empty', () => {
        expect(() => new Product("123", "", 10)).toThrowError("Name is required");
    })

    it('should throw error when price is less or equal zero', () => {
        expect(() => new Product("123", "Product 1", 0)).toThrowError("Price must be greater than zero");
    })

    it('should change name', () => {
        const product = new Product("123", "Product 1", 10);
        product.changeName("Product 2");
        expect(product.name).toBe("Product 2");
    })

    it('should change price', () => {
        const product = new Product("123", "Product 1", 10);
        product.changePrice(20);
        expect(product.price).toBe(20);
    })
})