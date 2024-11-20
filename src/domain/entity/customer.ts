import Address from "./address";

export default class Customer {

    private _id: string;
    private _name: string;
    private _address!: Address;
    private _active: boolean = false;
    private _rewardPoints: number = 0;

    constructor(id: string, name: string) {
        this._id = id;
        this._name = name;
        this.validate();
    }  
    
    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get address(): Address {
        return this._address;
    }

    isActive(): boolean {
        return this._active;
    }

    validate() {
        if(this._id.length === 0) {
            throw new Error('Id is required');
        }

        if(this._name.length === 0) {
            throw new Error('Name is required');
        }
    }

    changeAddress(address: Address) {
        this._address = address;
        this.validate();
    }

    changeName(name: string) {
        this._name = name;
        this.validate();
    }

    activate() {
        if(this._address === undefined) {
            throw new Error('Address is mantatory to activate a customer');
        }
        this._active = true;
    }

    addRewardPoints(points: number) {
        this._rewardPoints += points;
    }

    get rewardPoints(): number {
        return this._rewardPoints;
    }

    deactivate() {
        this._active = false;
    }
}