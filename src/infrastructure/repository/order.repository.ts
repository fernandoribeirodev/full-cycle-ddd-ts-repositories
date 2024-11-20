import Address from "../../domain/entity/address";
import Customer from "../../domain/entity/customer";
import Order from "../../domain/entity/order";
import OrderItem from "../../domain/entity/order_item";
import OrderRepositoryInterface from "../../domain/repository/order-repository.interface";
import OrderItemModel from "../db/sequelize/model/order-item.model";
import OrderModel from "../db/sequelize/model/order.model";

export default class OrderRepository implements OrderRepositoryInterface {
    async findAll(): Promise<Order[]> {
        throw new Error("Method not implemented.");
    }
    async create(entity: Order): Promise<void> {
        var order = {
            id: entity.id,
            customer_id: entity.customerId,
            total: entity.total,
            items: entity.items.map((i) => ({
                id: i.id,
                name: i.name,
                price: i.price,
                quantity: i.quantity,
                product_Id: i.productId,
                order_id: entity.id
            }))
        };
        await OrderModel.create(order,
            {
                include: [{ model: OrderItemModel }]
            })
        return Promise.resolve();
    }
    async update(entity: Order): Promise<void> {
        const orderModel = await OrderModel.findOne({ where: { id: entity.id }, include: ["items"] }).then((order) => {
            if(order) {
                order.customer_id = entity.customerId;
                order.total = entity.total;
                order.items.forEach(item => {
                    if(entity.items.find(i => i.id === item.id)) {
                        var sameItem = entity.items.find(i => i.id === item.id);
                        item.name = sameItem.name;
                        item.price = sameItem.price;
                        item.quantity = sameItem.quantity;
                        item.product_Id = sameItem.productId;
                    }else{
                        OrderItemModel.destroy({ where: { id: item.id } });
                    }
                });
                entity.items.forEach(item => {
                    if(!order.items.find(i => i.id === item.id)) {
                        OrderItemModel.create({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            product_Id: item.productId,
                            order_id: entity.id
                        });
                    }
                })
                order.items = entity.items.map((i) => OrderItemModel.build({
                    id: i.id,
                    name: i.name,
                    price: i.price,
                    quantity: i.quantity,
                    product_Id: i.productId,
                    order_id: entity.id
                }));
                order.save();
            }
            else {
                throw new Error("Order not found");
            }
        });
        
        return Promise.resolve();
    }
    async findById(id: string): Promise<Order> {
        const orderModel = await OrderModel.findOne({ where: { id: id }, include: ["items"] });
        const orderItems = orderModel.items.map(i => new OrderItem(i.id, i.product_Id, i.name, i.price, i.quantity));
        const order = new Order(orderModel.id, orderModel.customer_id, orderItems);
        return Promise.resolve(order);
    }

}