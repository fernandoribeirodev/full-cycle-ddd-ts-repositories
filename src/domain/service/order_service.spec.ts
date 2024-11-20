import Customer from "../entity/customer";
import Order from "../entity/order";
import OrderItem from "../entity/order_item";
import OrderService from "./order_service";

describe("Order service unit tests", () => {

    it("should place an order", () => {
        
        const customer = new Customer("123", "John");
        const item1 = new OrderItem("1", "Item 1", "p1", 100, 2);
        const item2 = new OrderItem("2", "Item 2", "p2", 200, 2);

        const order = OrderService.placeOrder(customer, [item1, item2]);

        expect(customer.rewardPoints).toBe(300);
        expect(order.total).toBe(600);

    });

    it("should calculate total of all orders", () => {
        
        const item1 = new OrderItem("1", "Item 1", "p1", 100, 1);
        const item2 = new OrderItem("2", "Item 2", "p2", 200, 2);
        const item3 = new OrderItem("3", "Item 3", "p3", 300, 3);
        const order = new Order("123", "123", [item1, item2, item3]);

        const item4 = new OrderItem("4", "Item 4", "p4", 400, 4);
        const item5 = new OrderItem("5", "Item 5", "p5", 500, 5);
        const item6 = new OrderItem("6", "Item 6", "p6", 600, 6);
        const order2 = new Order("456", "456", [item4, item5, item6]);

        const total = OrderService.total([order, order2]);

        expect(total).toBe(9100);

    });
})