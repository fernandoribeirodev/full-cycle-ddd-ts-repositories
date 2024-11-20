import Address from './domain/entity/address';
import Costumer from './domain/entity/customer';
import Order from './domain/entity/order';
import OrderItem from './domain/entity/order_item';
let customer = new Costumer('123', 'John');
const address = new Address('Street', 123, '00000-000', 'City');

customer.changeAddress(address);
customer.activate();

const item1 = new OrderItem('1', 'Item 1', 'p1', 10, 2);
const item2 = new OrderItem('2', 'Item 2', 'p2', 20, 2);
const order = new Order('1', '123', [item1, item2]);
