import { Id } from "..";
import { RelationalService, Service } from "./service";

export class InMemory<Item extends Id.WithId> implements Service<Item> {
    protected items = new Map<Item["id"], Item>();

    constructor(mockData: Item[]) {
        mockData.forEach(item => this.set(item))
    }

    public async set(item: Item): Promise<void> {
        this.items.set(item.id, item);
    }

    public async get(id: Item["id"]): Promise<Item> {
        const found = this.items.get(id);
        if (found) {
            return found;
        }
        throw "no found";
    };

    public async getAll(): Promise<Item[]> {
        await new Promise(res => setTimeout(res, 1000));
        return [...this.items.values()];
    }

    public async delete(id: Item["id"]): Promise<void> {
        this.items.delete(id);
    }
}

export class RelationalInMemory<
    Parent extends Id.WithId,
    Item extends Id.WithId & Id.WithParents<Parent>,
> extends InMemory<Item> implements RelationalService<Parent, Item> {
    constructor(mockData: Item[]) {
        super(mockData);
    }

    public async getByParentId(id: Parent["id"]): Promise<Item[]> {
        return [...this.items.values()]
            .filter(({ parents }) => parents[id] !== undefined)
            .sort((a, b) => a.parents[id] - b.parents[id])
    }
}