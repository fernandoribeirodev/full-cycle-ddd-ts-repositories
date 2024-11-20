import OrderItem from "./order_item";
export default class Order {
    private _id: string;
    private _customerId: string;
    private _items: OrderItem[] = [];
    private _total: number = 0;
    constructor(id: string, customerId: string, items: OrderItem[]) {
        this._id = id;
        this._customerId = customerId;
        this._items = items;
        this._total = this.getTotal();
        this.validate();
    }
    validate(): Boolean {
        if(this._id.length === 0) {
            throw new Error('Id is required');
        }
        if(this._customerId.length === 0) {
            throw new Error('CustomerId is required');
        }
        if(this._items.length === 0) {
            throw new Error('Items are required');
        }
        return true;
    }
    get id(): string {
        return this._id;
    }
    get customerId(): string {
        return this._customerId;
    }
    get items(): OrderItem[] {
        return this._items;
    }
    get total(): number {
        return this._total;
    }
    addItem(item: OrderItem) {
        this._items.push(item);
        this._total = this.getTotal();
    }
    removeItem(item: OrderItem) {
        const itemIndex = this._items.findIndex(i => i.id === item.id);
        if(itemIndex >= 0) {
            this._items.splice(itemIndex, 1);
        }
        this._total = this.getTotal();
    }
    removeItems() {
        this._items = [];
        this._total = 0;
    }
    changeItems(items: OrderItem[]) {
        this.removeItems();
        items.forEach(item => this.addItem(item))
        this._total = this.getTotal();
    }
    getTotal(): number {
        return this._items.reduce((total, item) => total + item.orderItemTotal(), 0);
    }
}