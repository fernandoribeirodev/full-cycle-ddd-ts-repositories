import Address from "./address";
import Customer from "./customer";
describe("Custumer unit tests", () => {
    it("should throw error when id is empty", () => {
        expect(() => new Customer("", "John Doe")).toThrowError("Id is required");
    });

    it("should throw error when name is empty", () => {
        expect(() => new Customer("123", "")).toThrowError("Name is required");
    });

    it("should change name", () => {
        const customer = new Customer("123", "John Doe");
        customer.changeName("Jane");
        expect(customer.name).toBe("Jane");
    })

    it("should activate customer", () => {
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        customer.activate();
        expect(customer.isActive()).toBe(true);
    })
    
    it("should deactivate customer", () => {
        const customer = new Customer("123", "John Doe");
        const address = new Address("Street", 123, "00000-000", "City");
        customer.changeAddress(address);
        customer.activate();
        customer.deactivate();
        expect(customer.isActive()).toBe(false);
    })

    it("should init deactivate customer", () => {
        const customer = new Customer("123", "John Doe");
        expect(customer.isActive()).toBe(false);
    })

    it("should throw error when address is empty to activate a customer", () => {
        const customer = new Customer("123", "John Doe");
        expect(() => customer.activate()).toThrowError("Address is mantatory to activate a customer");
    })

    it("should add reward points", () => {
        const customer = new Customer("123", "John Doe");
        
        expect(customer.rewardPoints).toBe(0);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(10);

        customer.addRewardPoints(10);
        expect(customer.rewardPoints).toBe(20);
    })
})