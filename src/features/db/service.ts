import { Id } from "..";

export interface Service<Item extends Id.WithId> {
    set: (item: Item) => Promise<void>;
    get: (id: Item["id"]) => Promise<Item>;
    getAll: () => Promise<Item[]>;
}

export interface RelationalService<
    Parent extends Id.WithId,
    Item extends Id.WithId,
> extends Service<Item> {
    getByParentId: (id: Parent["id"]) => Promise<Item[]>;
}

