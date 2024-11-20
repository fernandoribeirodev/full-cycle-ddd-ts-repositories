import { Sequelize } from "sequelize-typescript";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerRepository from "./customer.repository";
import CustomerModel from "../db/sequelize/model/customer.model";


describe("Customer repository tests", () => {
    let sequelize: Sequelize;

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: "sqlite",
            storage: ":memory:",
            logging: false,
            sync: { force: true },
        });

        sequelize.addModels([CustomerModel]);
        await sequelize.sync();
    });

    afterEach(async () => {
        await sequelize.close();
    });

    it("should create a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        customer.activate();
        await customerRepository.create(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: address.street,
            number: address.number,
            zip: address.zip,
            city: address.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    });

    it("should update a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        customer.activate();
        customer.changeName("Customer 2");
        const newAddress = new Address("Street 2", 123, "00000-000", "City 2");
        customer.addRewardPoints(100);
        customer.changeAddress(newAddress);
        await customerRepository.update(customer);

        const customerModel = await CustomerModel.findOne({ where: { id: customer.id } });
        expect(customerModel.toJSON()).toStrictEqual({
            id: customer.id,
            name: customer.name,
            street: newAddress.street,
            number: newAddress.number,
            zip: newAddress.zip,
            city: newAddress.city,
            active: customer.isActive(),
            rewardPoints: customer.rewardPoints
        });
    });

    it("should find a customer", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);

        const customerResult = await customerRepository.findById(customer.id);
        expect(customer).toStrictEqual(customerResult);
    });

    it("should throw error when not found a customer", async () => {
        const customerRepository = new CustomerRepository();
        expect(async () => await customerRepository.findById("456ABC")).rejects.toThrow("Customer not found");
    });

    it("should return all customers", async () => {
        const customerRepository = new CustomerRepository();
        const customer = new Customer("123", "Customer 1");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        await customerRepository.create(customer);
        const customer2 = new Customer("456", "Customer 2");
        const address2 = new Address("Street 2", 123, "00000-000", "City 2");
        customer2.changeAddress(address2);
        await customerRepository.create(customer2);
        const foundCustomers = await customerRepository.findAll();
        expect(foundCustomers).toHaveLength(2);

        const customers = [customer, customer2];
        expect(customers).toEqual(foundCustomers);
    });
});
