import Order from "./order";
import OrderItem from "./order_item";

describe('Order unit tests', () => {
    it('should throw error when id is empty', () => {
        expect(() => new Order("", "123", [])).toThrowError("Id is required");
    });

    it('should throw error when customerId is empty', () => {
        expect(() => new Order("123", "", [])).toThrowError("CustomerId is required");
    });

    it('should throw error when items is empty', () => {
        expect(() => new Order("123", "123", [])).toThrowError("Items are required");
    });

    it('should calculate total', () => {
        const order = new Order("123", "123", [
            new OrderItem("1", "Item 1", "p1", 10, 2),
            new OrderItem("2", "Item 2", "p2", 20, 1),
        ]);
        const orderItem3 = new OrderItem("3", "Item 3", "p3", 30, 3);
        order.addItem(orderItem3);

        expect(order.total).toBe(130);
    })
})