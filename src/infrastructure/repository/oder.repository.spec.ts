import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";
import OrderModel from "../db/sequelize/model/order.model";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import ProductModel from "../db/sequelize/model/product.model";
import Product from "../../domain/entity/product";
import ProductRepository from "./product.repository";
import OrderItem from "../../domain/entity/order_item";
import Order from "../../domain/entity/order";
import OrderRepository from "./order.repository";


describe("Order repository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel, ProductModel, OrderModel, OrderItemModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("003", "Customer 3");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("002", "Product 2", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderRepository = new OrderRepository();
        const order = new Order("001", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
          });
 expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_Id: orderItem.productId
                }
            ]
        });
    })

    it("should update a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("003", "Customer 3");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("002", "Product 2", 10);
        const product2 = new Product("004", "Product 4", 15);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderRepository = new OrderRepository();
        const order = new Order("001", customer.id, [orderItem]);
        await orderRepository.create(order);

        const orderModel = await OrderModel.findOne({
            where: { id: order.id },
            include: ["items"],
          });
        expect(orderModel.toJSON()).toStrictEqual({
            id: order.id,
            customer_id: customer.id,
            total: order.total,
            items: [
                {
                    id: orderItem.id,
                    name: orderItem.name,
                    price: orderItem.price,
                    quantity: orderItem.quantity,
                    order_id: order.id,
                    product_Id: orderItem.productId
                }
            ]
        });

        const orderItem2 = new OrderItem("2", product.id, product.name, product.price, 4);
        order.changeItems([orderItem2]);
        await orderRepository.update(order);

        const foundOrder = await orderRepository.findById(order.id);
        expect(foundOrder).toStrictEqual(order);
    })

    it("should find a order", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("003", "Customer 3");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        
        const productRepository = new ProductRepository();
        const product = new Product("002", "Product 2", 10);
        await productRepository.create(product);

        const orderItem = new OrderItem("1", product.id, product.name, product.price, 2);
        const orderRepository = new OrderRepository();
        const order = new Order("001", customer.id, [orderItem]);
        await orderRepository.create(order);

        const foundOrder = await orderRepository.findById(order.id);
        expect(foundOrder).toStrictEqual(order);
    })
})