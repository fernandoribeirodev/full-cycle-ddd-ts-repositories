import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import CustomerRepositoryInterface from "../../domain/repository/customer-repository.interface";
import CustomerModel from "../db/sequelize/model/customer.model";


export default class CustomerRepository implements CustomerRepositoryInterface {
    
    async create(entity: Customer): Promise<void> {
        await CustomerModel.create({
            id: entity.id,
            name: entity.name,
            street: entity.address.street,
            number: entity.address.number,
            zip: entity.address.zip,
            city: entity.address.city,
            active: entity.isActive(),
            rewardPoints: entity.rewardPoints
        })
        return Promise.resolve();
    }

    async findAll(): Promise<Customer[]> {
        const customerModels = await CustomerModel.findAll();
        const customers = customerModels.map(customerModel => {
            const customer = this.getCustomerByModel(customerModel);
            return customer;
        });
        return Promise.resolve(customers);
    }
    async update(entity: Customer): Promise<void> {
        const customerModel = await CustomerModel.findOne({ where: { id: entity.id } });
        customerModel.name = entity.name;
        customerModel.street = entity.address.street;
        customerModel.number = entity.address.number;
        customerModel.zip = entity.address.zip;
        customerModel.city = entity.address.city;
        customerModel.active = entity.isActive();
        customerModel.rewardPoints = entity.rewardPoints;
        await customerModel.save();
        return Promise.resolve();
    }
    async findById(id: string): Promise<Customer> {
        let customerModel: CustomerModel;
        try {
            customerModel = await CustomerModel.findOne({ where: { id: id }, rejectOnEmpty: true });
        } catch (error) {
            throw new Error("Customer not found");
        }
        const customer = this.getCustomerByModel(customerModel);
        return Promise.resolve(customer);        
    }

    private getCustomerByModel(customerModel: CustomerModel) {
        const customer = new Customer(customerModel.id, customerModel.name);
        const address = new Address(customerModel.street, customerModel.number, customerModel.zip, customerModel.city);
        customer.changeAddress(address);
        customerModel.active ? customer.activate() : customer.deactivate();
        customer.addRewardPoints(customerModel.rewardPoints);
        return customer;
    }
}